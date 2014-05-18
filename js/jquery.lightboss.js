/* **************************************************************************************
*****************************************************************************************
*****************************************************************************************
*****************************************************************************************
*****************************************************************************************
*****************************************************************************************

	LightBoss version 1.0
-----------------------------------------------------------------------------------------
	Powered by Philippe Assis
	www.philippeassis.com
-----------------------------------------------------------------------------------------
	License (en-us): 

	This thing is free to do what you want with it! 
	Adding to your business website or even wipe your ass (if that is possible). 
	Use and abuse at will!
-----------------------------------------------------------------------------------------
	!!!!!IMPORTANT!!!!!
	The use of Jquery is required
	During the development of this plugin was used aversion 1.9.1 of jQuery.
	
*****************************************************************************************
*****************************************************************************************
*****************************************************************************************
*****************************************************************************************
*****************************************************************************************
************************************************************************************** */

(function ($) {
	$.fn.lightboss = function (o, func) {

		var O = {	
			'event' : 'click',//Evento de ação para chamar o lightboss; Use 'start' para abrir um objeto assim que a pagina for lida
			'gif' : 'default',// prepreLoader em gif. Opções adicionadas: default, pacman, snake, arrows, facebook
			'effectTrans' : 'resize',// Efeito de transição. Opções adicionadas: resize, fade			
			'maxHeight' : 600,// Tamanho vertical maximo de um lightboss
			'maxWidth' : 1000,// Tamanho horizontal maximo de um lightboss			
			'timeStar' : 250,// Tempo de abertura do lightboss
			'timeTrans' : 250,// Tempo de transição do lightboss
			'timeDisplayPreLoad' : 250,// VERIFICAR - Tempo que o preload leva para sumir depois que o eventLoad for concluido
			'timeClose' : 250,//Tempo de fechamento do lightboss
			'attr' : 'href',//Argumento a ser lido quando o "event" for chamado					
			'print' : 'append',//Posição em que o lightboss sera escrito apartir do DOMprint
			'DOMprint' : 'body',// Local onde o lightboss sera escrito
			'navigation' : false,// Navegação
			'navigationEffect' : true,//Efeito de transição da navegação
			'navigationTimeEffect' : false,// Tempo de efeito de transição da navegação. Use false para padrão
			'arrowsPositionValue' : false,// Valor da posição das setas de navegação
			'arrowsPosition' : 'in',// Posição das setas de navegação, dentro (in) ou fora (out) do lightboss
			'log' : false,// Ler logs no console do navegador
			'background' : 'black', // backgrouds do lightboss. Opções adicionadas: black e white
			'clone' : false, // Clonar ou não elementos de uma div ou tag diversa. Se true, o alvo será copiado sem que nenhuma mudança seja relizada nele, mas caso false o alvo sera "recortado" da sua posiçã atual
			'tools' : [ function(){ return $('<a>').addClass('close') } ] //HTML com o conteúdo das ferramentas (Tools)
		};
		
		o = $.extend(O, o);// Uni as configurações por default e as adicionadas
				
		/* **********************************************************************************
			FUNÇÕES ADICIONADAS
			Você pode adicionar funções a serem executadas durante o lightboss.
			
			Para saber quando cada função é chamada, alive o 'log' nas opções e 
			acompanhe execução do lightboss no console do navegador
		********************************************************************************** */
		var F = {
			'ini' : function () {},
			'winSize' : function () {},
			'verificBrowser' : function () {},
			'startBoss' : function () {},
			'linkType' : function () {},
			'loadBox' : function () {},
			'openBox' : function () {},
			'getAttrLoad' : function () {},
			'boxPosition' : function () {},
			'closeBox' : function () {},
			'navigation' : function () {},
			'nameElements' : function () {},
			'styleArrows' : function () {},
			'controlArrows' : function () {},
			'activeArrows' : function () {},
			'createArrows' : function () {},
			'finishPrint' : function () {},
			'limitMax' : function () {},
			'startTools' : function () {},
			'navHtmlArrows' : false,
			'html' : false
		};		
		
		func = $.extend(F, func);
		
		// Funções
		var lf = {};
		
		//Dados
		var lo = {};
		
		
		/* **********************************************************************************
			FUNÇÕES PADRÕES DO LIGTHBOSS
		********************************************************************************** */
		
		//Inicio de processos basicos do lightboss. Essa função é chamada quando o 'event' é feito
		lf.ini = function(Obj) {						
			lf.c_log('ini');						
			
			o.elementCurrent = Obj;// Pegando elemento
			
			func.ini.call(Obj, o, lf, lo);
			
			lf.winSize();
			
			lf.verificBrowser();

			lo.eThis = $(Obj);
			
			if (o.navigation && !lo.refCurrent)
				lo.refCurrent = eval(lo.eThis.attr('ref'));							
				
			lf.startBoss();
			
			return false;
		}
		
		//Execução do lightboss
		lf.startBoss = function() {						
			lf.c_log('startBoss');
			func.startBoss.call(lo.currentStage, o, lf, lo);
			hrefLink = lo.eThis.attr(o.attr);
			lo.linkType = lf.linkType(hrefLink);

			if (!func.html) {				
				if (lo.linkType == 'image') {
					lo.eventLoad = 'load';
					lo.dinamicHtml = $('<img>');
					lo.dinamicHtml.attr('src',hrefLink);
					lo.dinamicHtml = '<img src="'+hrefLink+'" alt="'+hrefLink+'"/>';
					lo.targetLoad = 'img';
				} 
				else if (lo.linkType == 'div') {
					lo.eventLoad = 'ready';
					div_target = (o.event == 'start') ? lo.elementsAll : hrefLink;					
					lo.dinamicHtml = o.clone ? $(div_target).clone() : $(div_target);																				
					lo.dinamicHtml.show();
					lo.targetLoad = hrefLink;
				}
				else if (lo.linkType == 'iframe') {
					lo.eventLoad = 'load';		
					lo.dinamicHtml = $('<iframe>');
					lo.dinamicHtml.attr({ frameBorder : 0, height : o.maxHeight, width : o.maxWidth, 'src' : hrefLink});					
					lo.targetLoad = 'iframe';					
				}
			} 
			else {
				funcHtml = func.html.call(lo.currentStage, o, lf, lo);
				lo.eventLoad = funcHtml[0];
				lo.targetLoad = funcHtml[1];
				lo.dinamicHtml = funcHtml[2];				
			}
			
			//Animação de abertura do LightBoss
			lo.elightboss.fadeIn(o.timeStar, function () {					
				if(lo.linkType == 'image')
					lo.currentStage = lo.eLoad.html(lo.dinamicHtml);
				else
					lo.currentStage = lo.dinamicHtml.appendTo(lo.eLoad);					
				lf.loadBox();
			})

			$('.content').bind({
				'mouseleave' : function () {
					lo.enterBox = false;					
				},
				'mouseenter' : function () {
					lo.enterBox = true;					
				}
			})
			
			lo.elightboss.click(function () {				
				if (lo.enterBox === false)
					lf.closeBox();
			})
			
			$(document).bind({
				'keydown' : function (event) {
					if (event.keyCode == 27) {
						lf.closeBox();
						return false;
					}
				}
			})
			
			$('a,li,img', lo.eTools).bind({
				'click' : function () {
					lf.closeBox();
				},
				'mouseenter' : function () {
					$(this).animate({
						'opacity' : '1.0'
					}, 0)
				},
				'mouseleave' : function () {
					$(this).animate({
						'opacity' : '0.8'
					}, 250)
				}
			});

		}
		
		lf.loadBox = function() {
			lf.c_log('loadBox');
			func.loadBox.call(lo.currentStage, o, lf, lo);
			if (lo.linkType == 'image' || lo.linkType == 'iframe') {
				$(lo.targetLoad, lo.eLoad).bind(lo.eventLoad, function () { 
					lf.openBox();
				});
			} else if (lo.linkType == 'div') {
				lf.openBox();
			}
		}
		
		lf.limitMax = function() {
			lf.c_log('limitMax');
			func.limitMax.call(lo.currentStage, o, lf, lo);
			heimax = $(window).height() - 80;
			if (o.maxHeight)
				if (o.maxHeight < heimax)
					heimax = o.maxHeight;
						$('#'+lo.lightBossName+' img').css({
							'max-height' : heimax + 'px'
						});		
			widmax = $(window).width() - 80;
			if (o.maxWidth)
				if (o.maxWidth < widmax)
					widmax = o.maxWidth;
						$('#'+lo.lightBossName+' img').css({
							'max-width' : widmax + 'px'
						});			
		}
		
		lf.openBox = function() {
			lf.c_log('openBox');
			func.openBox.call(lo.currentStage, o, lf, lo);
			if (lo.linkType == 'image')
				lf.limitMax();
			lf.getAttrLoad();
			lo.epreLoader.stop().fadeOut(o.timeEffectLoad, function () {
				lf.boxPositionAndEffect();
				lo.oppenBox = true;				
			})
		
			$(window).bind({
				'resize' : function () {
					lf.boxPositionAndEffect(0,true);					
				}
			})
		}
		
		lf.startTools = function() {	
			lf.c_log('startTools');
			func.startTools.call(lo.currentStage, o, lf, lo);
			lo.eTools.fadeIn(200);
			lo.eTools.css('opacity', '0.8');					
			lf.initnavis(); // Inicia a a navegação				
		}
		
		lf.boxPositionAndEffect = function(ANIMATE,RESIZE) {
			lf.c_log('boxPositionAndEffect'); 
			func.boxPosition.call(lo.currentStage, o, lf, lo);
			
			if (o.navigation && lo.arrowsAll && !RESIZE)
				lo.arrowsAll.fadeOut(o.timeTrans / 2);
				
			newPropElement = {
				'width' : lo.widthLoad + 'px',
				'height' : lo.heightLoad + 'px',
				'margin-top' : ((eval(lo.winSizeH) - eval(lo.heightLoad)) / 2) + 'px',
				'padding' : 5 + 'px'
			}					
			
			if (lo.linkType == 'iframe') {
				Iframe = $('.load iframe', lo.elightboss)//.contents();				
				newPropElement['padding-left'] = '5px';
				newPropElement['padding-top'] = '5px';
				newPropElement['padding-right'] = '5px';
				newPropElement['padding-bottom'] = '5px';
				$(lo.eTools).css('margin-right','-25px');
				
				if($(Iframe).height() > lo.heightLoad ){
					newPropElement['padding-right'] = '20px';
					$(lo.eTools).css('margin-right','-40px');
				}
				if($(Iframe).width() > lo.widthLoad ){
					newPropElement['padding-bottom'] = '15px';					
				}
			}
			if (ANIMATE !== 0) {
				if (o.effectTrans == 'resize')
					lo.eContent.animate(newPropElement, o.timeTrans, function () {
						lf.finishPrint();
					});
				else if (o.effectTrans == 'fade') {
					lo.eContent.fadeOut(o.timeTrans, function () {
						$(this).css(newPropElement).fadeIn(o.timeTrans, function () {
							lf.finishPrint();
						});
					});
				} else {
					lo.eContent.css(newPropElement);
					lo.eLoad.fadeIn(o.timeEffectLoad);
					lf.finishPrint();
				}
			} else {
				lo.eContent.css(newPropElement);
				lo.eLoad.fadeIn(o.timeEffectLoad);
			}
			
		}
		
		lf.finishPrint = function() {
			lf.c_log('finishPrint');
			func.finishPrint.call(lo.currentStage, o, lf, lo);
			lo.eLoad.fadeIn(o.timeDisplayPreLoad, function () {
				lf.startTools();
				lf.getAttrLoad();
			});
			lf.c_log(lo.refCurrent);
		}
		
		lf.initnavis = function(){
			lf.c_log('initnavis');			
			if (o.navigation && !lo.navExecute)
					lf.navigation();
			if (o.navigation)
				lf.styleArrows(true);				
				
		}
		
		lf.getAttrLoad = function(){
			lf.c_log('getAttrLoad');
			func.getAttrLoad.call(lo.currentStage, o, lf, lo);			
			if ($('.load', lo.elightboss).width() && lo.linkType != "iframe")
				lo.widthLoad = $('.load', lo.elightboss).width();				
		    else {
				Iframe = $('.load iframe', lo.elightboss)//.contents().bind('html');
				Iframe = $(Iframe[0]).width();
				if(Iframe < o.maxWidth && Iframe > 0)
					lo.widthLoad = Iframe;
				else
					lo.widthLoad = o.maxWidth;
			}
			
			if ($('.load', lo.elightboss).height() && lo.linkType != "iframe")
				lo.heightLoad = $('.load', lo.elightboss).height();
			 else {
				Iframe = $('.load iframe', lo.elightboss)//.contents();
				Iframe = $(Iframe).height();
			
				if(Iframe < o.maxHeight && Iframe > 0)
					lo.heightLoad = Iframe;
				else
					lo.heightLoad = o.maxHeight;
			}		
		}
		
		lf.linkType = function(L) {
			lf.c_log('getlo.linkType');
			func.linkType.call(lo.currentStage, o, lf, lo);
			if (L == undefined && o.event == 'start')
				return 'div';
			else if (L == undefined)
					return false;
			if (L.substring(0, 1) == "#") {
				return "div";
			} else {
				Limg = L.split('.').reverse();
				Limg = Limg[0].toLowerCase();
				if (Limg == 'jpg' || Limg == 'jpeg' || Limg == 'jpe' || Limg == 'jfif' || Limg == 'png' || Limg == 'tiff' || Limg == 'tif' || Limg == 'gif' || Limg == 'ico' || Limg == 'dib' || Limg == 'bmp') {
					return "image";
				} else return "iframe";
			
			}
		}
		
		lf.winSize = function() {
			lf.c_log('winSize');
			func.winSize.call(lo.currentStage, o, lf, lo);
			$(window).bind({
				'resize' : function () {
					lo.winSizeW = $(window).width();
					lo.winSizeH = $(window).height();
				}
			})
			$(document).ready(function () {
				lo.winSizeW = $(window).width();
				lo.winSizeH = $(window).height();
			})
			
		}
		
		lf.closeBox = function() {
			lf.c_log('closeBox');
			func.closeBox.call(lo.currentStage, o, lf, lo);
			lo.elightboss.fadeOut(o.timeClose, function () {
				lo.eContent.attr('style', '').css({
					'width' : '100px',
					'height' : '100px'
				});
				lo.epreLoader.attr('style', '');
				lo.eLoad.attr('style', '').hide().html('');
				lo.eTools.hide();
				if (o.navigation) {
					if (lo.arrowsAll)
						lo.arrowsAll.hide();
					o.timeEffectLoad = lo.timeEffectLoad_save;
					o.effectTrans = lo.effectTrans_save;
					lo.navExecute = false;
				}
				lo.refCurrent = false;
				lo.elementCurrent = false;
				lo.oppenBox = false;				
			})
		}
		
		lf.verificBrowser = function() {
			lf.c_log('verificBrowser');
			func.verificBrowser.call(lo.currentStage, o, lf, lo);						
		}
		
		lf.navigation = function(){
			lf.c_log('navigation');
			func.navigation.call(lo.currentStage, o, lf, lo);
	 
			lo.FirstNav = false;
			if (lo.arrowsAll == undefined) { 
				lo.elightboss.append(lf.navHtmlArrows('left'));
				lo.elightboss.append(lf.navHtmlArrows('right'));
		
				lo.arrowLeft = $('.arrows.left', lo.elightboss);
				lo.arrowRight = $('.arrows.right', lo.elightboss);
				lo.arrowsAll = $('.arrows.left,.arrows.right', lo.elightboss);
				
			}

			lf.controlArrows();
			lf.styleArrows(false);	
		
			lo.arrowsAll.fadeIn();					
		}
		
		lf.arrowsPositions = function() {
			lf.c_log('arrowsPositions');
			if (o.arrowsPosition == 'in' && o.arrowsPositionValue == false)
				o.arrowsPositionValue = 0; 
			else if (o.arrowsPosition == 'out' && o.arrowsPositionValue == false)
						o.arrowsPositionValue = 60;
		}
		
		lf.styleArrows = function(eLoad) {
			lf.c_log('styleArrows');
			func.styleArrows.call(lo.currentStage, o, lf, lo);
			lf.arrowsPositions();
			lo.navExecute = true;
			opacityArrows = '0.3';	
			if (eLoad === false){
				exprecionPosition = (((lo.winSizeW / 2) - ($(lo.targetLoad, eLoad).width() / 2)) + 10) + 'px';							
				// if ($.browser.msie && $.browser.version < 9.0) {
					// lo.arrowsAll.addClass('ie7');
				// } else lo.arrowsAll.addClass('default');
				lo.arrowsAll.addClass('default');
				lo.arrowLeft.css({
					'opacity' : opacityArrows,
					'left' : '-'+exprecionPosition
				}).bind({
					'mouseenter' : function () {
						$(this).animate({
							'opacity' : '1.0'
						}, 150);
					},
					'mouseleave' : function () {
						$(this).animate({
							'opacity' : opacityArrows
						}, 250);
					}
				});
				lo.arrowRight.css({
					'opacity' : opacityArrows,
					'right' : exprecionPosition
				}).bind({
					'mouseenter' : function () {
						$(this).animate({
							'opacity' : '1.0'
						}, 150);
					},
					'mouseleave' : function () {
						$(this).animate({
							'opacity' : opacityArrows
						}, 250);
					}
				});
				
				$(window).resize(function () {
					lo.arrowLeft.css({
						'opacity' : opacityArrows,
						'left' : (((lo.winSizeW / 2) - ($(lo.targetLoad, lo.eLoad).width() / 2)) + (10 - eval(o.arrowsPositionValue))) + 'px'
					});
					lo.arrowRight.css({
						'opacity' : opacityArrows,
						'right' : (((lo.winSizeW / 2) - ($(lo.targetLoad, lo.eLoad).width() / 2)) + (10 - eval(o.arrowsPositionValue))) + 'px'
					});
				})
				
			} 
			else {	
				lo.arrowLeft.css({
					'opacity' : opacityArrows,
					'left' : (((lo.winSizeW / 2) - ($(lo.targetLoad,lo.eLoad).width() / 2)) + (10 - eval(o.arrowsPositionValue))) + 'px'
				});
				lo.arrowRight.css({
					'opacity' : opacityArrows,
					'right' : (((lo.winSizeW / 2) - ($(lo.targetLoad,lo.eLoad).width() / 2)) + (10 - eval(o.arrowsPositionValue))) + 'px'
				});
				lo.arrowsAll.show();
			}
			func.styleArrows.call(lo.currentStage, o, lf, lo);			
			lo.navExecute = false;
		}
		
		lf.controlArrows = function() {
			lf.c_log('controlArrows')
			func.controlArrows.call(lo.currentStage, o, lf, lo);
			$(lo.arrowLeft).click(function () {
				lf.activeArrows('prev');
				return false;
			})
			$(lo.arrowRight).click(function () {
				lf.activeArrows('next');
				return false;
			})
			$(document).bind({
				'keydown' : function (event) {					
					if(!o.navigation || !lo.oppenBox)
						return false;
					if (event.keyCode == 37) {
						$(lo.arrowLeft).click();
						return false;
					} else if (event.keyCode == 39) {
						$(lo.arrowRight).click();
						return false;
					}
				}
			});
		}
		
		lf.c_log = function(text) {
			if(o.log) console.log(text)
		}
		
		lf.activeArrows = function(Arrow) {		
			lf.c_log('activeArrows');			
			if (lo.navExecute === true)
				return false;
			else if (lo.navExecute === false) {
				lo.navExecute = true;
				func.activeArrows.call(lo.currentStage, o, lf, lo)
				if (Arrow == "prev") {
					if (lo.refCurrent > 0) {
						lo.refCurrent = lo.refCurrent - 1;
					} else {
						lo.refCurrent = (lo.refLength - 1);
					}
				} else if (Arrow == "next") {
					refLimit = lo.refLength - 1;
					if (lo.refCurrent < refLimit) {
						lo.refCurrent = lo.refCurrent + 1;
					} else {
						lo.refCurrent = 0;
					}
				}
				lo.epreLoader.css({
					'position' : 'absolute',
					'top' : '50%',
					'left' : '50%',
					'margin-top' : '-50px',
					'margin-left' : '-50px'
				})
				lo.eThis = $('.linkboss[ref=' + lo.refCurrent + ']')
				lo.elementCurrent = lo.eThis;
				if (!o.navigationEffect) {
					o.effectTrans = 0;
					o.timeEffectLoad = 0;
				}
				if (o.navigationTimeEffect) {
					o.timeEffectLoad = o.navigationTimeEffect;
				}
				lo.arrowsAll.stop().fadeOut(100);
				lo.eLoad.fadeOut(250, function () {
					if(lo.arrowsAll != undefined)						
					lf.c_log(lo.refCurrent)
					$(this).attr('display', 'none')
					lo.epreLoader.fadeIn(0)
					lf.startBoss();					
				})
			}
		}
		
		lf.navHtmlArrows = function(type) {
			lf.c_log('navHtmlArrows')
			if (func.navHtmlArrows)
				return func.navHtmlArrows.call(lo.currentStage, o, lf, lo)
			return '<div class="arrows ' + type + '" style="display:none"></div>';
		}
		
		lf.nameElements = function(elem) {
			lf.c_log('nameElements')
			func.nameElements.call(lo.currentStage, o, lf, lo)
			ParentAll = $(elem);
			for (i = 0; ParentAll.length > i; i++) {
				$(ParentAll[i]).attr('ref', i)
			}			
		}
		
		lf.createTools = function(){
			lf.c_log('createTools');
			Tools = '';
			List = $('<li>');
			if(o.tools)
				for(i=0;o.tools.length>i;i++){
					Obj = o.tools[i].call(lo.currentStage, o, lf, lo);					
					Obj.appendTo(List)
				}
				
			return List;
		}
		
		/* 
			CACHEAMENTOS E ELEMENTOS
		*/
		
		//Criando um novo lightboss
		countBox = 0;		
		while($('#lightboss-'+countBox).is('div'))
			++countBox;
				
		//Nome da lightboss atual
		lo.lightBossName = 'lightboss-'+countBox;
		
		//Criando elementos do lightboss
	
		lo.htmlLightbox = $('<div>').attr({ 'id' : lo.lightBossName, 'class' : 'lightboss-style ' + o.background });			
		
		List = 	lf.createTools();
		Content = $('<div>').attr({'class' : 'content'});
		Tools = $('<div>').attr({'class' : 'tools'}).css('display','none');						
		Loader = $('<div>').attr({'class' : 'loader'});
		Load = $('<div>').attr({'class' : 'load'}).css('display','none');

		List.appendTo(Tools);
		Tools.appendTo(Content);
		Loader.appendTo(Content);
		Load.appendTo(Content);
		Content.appendTo(lo.htmlLightbox);
		
			
		//Imprimindo elementos do lightboss na página
		if (o.print == 'prepend')
			$(o.DOMprint).prepend(lo.htmlLightbox);
		else if (o.print == 'append')
			$(o.DOMprint).append(lo.htmlLightbox);
		else if (o.print == 'before')
			$(o.DOMprint).before(lo.htmlLightbox);
		else if (o.print == 'after')
			$(o.DOMprint).after(lo.htmlLightbox);
		
		
		/* 
			ELEMENTOS DO LIGHTBOSS
		*/
		
		lo.elightboss = $('#'+lo.lightBossName);// Base principal do lightboss
		lo.eContent = $('.content', lo.elightboss);// Conteúdo
		lo.eLoad = $('.load', lo.eContent);//Conteudo a ser carregado
		lo.epreLoader = $('.loader', lo.eContent);// Preload
		lo.eTools = $('.tools', lo.eContent);//Ferramentas
		lo.elementsAll = $(this);//Objetos selecionados
		lo.eThis;//Elemento atual selecionado apartir do alvo
		
		/* 
			AÇÕES INICIAIS
		*/
		lo.elightboss.hide();
		lo.eLoad.hide();
		lo.epreLoader.addClass(o.gif);		
		
		
		/* 
			CACHEAMENTOS INICIAIS
		*/		
		lo.targetLoad;// Alvo alvo ser carregado
		lo.linkType;//Tipo de link encontrado no 'o.attr'
		lo.eventLoad;//Ação que sera completada para que o lightboss abra (Exemplo: Após ready ou load, a imagem ou div abre)
		lo.widthLoad;//Tamanho horizontal atual do alvo
		lo.heightLoad;//Tamanho vertical atual do alvo
		lo.winSizeW;//Tamanho horizontal atual da janela do navegador
		lo.winSizeH;//Tamanho vertical atual da janela do navegador		
		lo.elementCurrent;// Elemento atual selecionado apartir do alvo (NÃO CACHEADO)
		lo.enterBox = false;// O mouse esta dentro ou fora do conteudo do lightboss
		lo.oppenBox = false;// Ganrante que o lightboss esta aberto ou fechado		
		/* 
				CACHEAMENTOS INICIAIS PARA NAVEGAÇÂO
		*/
		
		if (o.navigation && $(this).length > 1) {		
			lo.refCurrent;
			lo.refLength = eval($(this).length);			
			lf.nameElements($(this));
			lo.arrowLeft;
			lo.arrowRight;
			lo.arrowsAll;
			if (lo.navExecute == undefined)
				lo.navExecute = false;		
			lo.effectTrans_save = o.effectTrans;
			lo.timeEffectLoad_save = o.timeEffectLoad;
		}
		else
			o.navigation = false
			
		lo.elementsAll.addClass('linkboss');
		
		/* 
			Aderindo um evento ao LightBoss
		*/

		if (o.event == 'start')
			return lf.ini(lo.elementsAll);
		else
			lo.elementsAll.bind(o.event, function () {					
				return lf.ini(this);					
			});
						
	}
})(jQuery);