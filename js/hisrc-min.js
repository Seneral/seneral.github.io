(function($){$.hisrc={bandwidth:null,connectionTestResult:null,connectionKbps:null,connectionType:null,secondChanceUsed:null,};$.hisrc.defaults={useTransparentGif:!1,transparentGifSrc:'data:image/gif;base64,R0lGODlhAQABAIAAAMz/AAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',minKbpsForHighBandwidth:300,speedTestUri:'50K.jpg',speedTestKB:50,speedTestExpireMinutes:30,forcedBandwidth:!1,srcIsLowResolution:!0,minHDSize:1080,minRetinaSize:2560,secondChance:!1,};$.hisrc.speedTest=function(options){$(window).hisrc(options)};
	$.fn.hisrc=function(options){var settings=$.extend({callback:function(){}},$.hisrc.defaults,options),$els=$(this);var connection=navigator.connection||{type:0},isSlowConnection=connection.type==3||connection.type==4||/^[23]g$/.test(connection.type);var HDSupport=Math.max(screen.width,screen.height)>=settings.minHDSize,retinaSupport=Math.max(screen.width,screen.height)>=settings.minRetinaSize;var speedTestUri=settings.speedTestUri,STATUS_LOADING='loading',STATUS_COMPLETE='complete',LOCAL_STORAGE_KEY='fsjs',speedConnectionStatus,initSpeedTest=function(){if(speedConnectionStatus){return}
if(settings.forcedBandwidth){$.hisrc.bandwidth=settings.forcedBandwidth;$.hisrc.connectionTestResult='forced';speedConnectionStatus=STATUS_COMPLETE;$(document).trigger('speedTestComplete.hisrc');return}
if(!HDSupport){$.hisrc.connectionTestResult='skip';speedConnectionStatus=STATUS_COMPLETE;$(document).trigger('speedTestComplete.hisrc');return} $.hisrc.connectionType=connection.type;if(isSlowConnection){$.hisrc.connectionTestResult='connTypeSlow';speedConnectionStatus=STATUS_COMPLETE;$(document).trigger('speedTestComplete.hisrc');return}
try{var fsData=JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));if(fsData!==null){if((new Date()).getTime()<fsData.exp&&settings.speedTestExpireMinutes!==0){$.hisrc.bandwidth=fsData.bw;$.hisrc.connectionKbps=fsData.kbps;$.hisrc.connectionTestResult='localStorage';speedConnectionStatus=STATUS_COMPLETE;$(document).trigger('speedTestComplete.hisrc');return}}}catch(e){}
if(speedTestUri){var speedTestImg=document.createElement('img'),endTime,startTime,speedTestTimeoutMS;speedTestImg.onload=function(){endTime=(new Date()).getTime();var duration=Math.max((endTime-startTime)/1000,1);$.hisrc.connectionKbps=((settings.speedTestKB*1024*8)/duration)/1024;$.hisrc.bandwidth=($.hisrc.connectionKbps>=settings.minKbpsForHighBandwidth?'high':'low');
speedTestComplete('networkSuccess')};speedTestImg.onerror=function(){speedTestComplete('networkError',5)};speedTestImg.onabort=function(){speedTestComplete('networkAbort',5)};startTime=(new Date()).getTime();speedConnectionStatus=STATUS_LOADING;if(document.location.protocol==='https:'){speedTestUri=speedTestUri.replace('http:','https:')}
speedTestImg.src=speedTestUri+"?r="+Math.random();speedTestTimeoutMS=(((settings.speedTestKB*8)/settings.minKbpsForHighBandwidth)*1000)+350;setTimeout(function(){speedTestComplete('networkSlow')},speedTestTimeoutMS)}},speedTestComplete=function(connTestResult,expireMinutes){if(speedConnectionStatus===STATUS_COMPLETE){return}
if(settings.secondChance&&!$.hisrc.secondChanceUsed&&HDSupport&&$.hisrc.bandwidth==='low'&&(connTestResult==='networkSuccess'||connTestResult==='networkError'||connTestResult==='networkAbort')){$.hisrc.secondChanceUsed=!0;initSpeedTest();return}
speedConnectionStatus=STATUS_COMPLETE;$.hisrc.connectionTestResult=connTestResult;try{if(!expireMinutes){expireMinutes=settings.speedTestExpireMinutes} var fsDataToSet={kbps:$.hisrc.connectionKbps,bw:$.hisrc.bandwidth,exp:(new Date()).getTime()+(expireMinutes*60000)};localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(fsDataToSet))}catch(e){}
$(document).trigger('speedTestComplete.hisrc');$(document).off('speedTestComplete.hisrc')},setImageSource=function($el,src){if(settings.useTransparentGif){$el.attr('src',settings.transparentGifSrc).css('max-height','100%').css('max-width','100%').css('background','url("'+src+'") no-repeat 0 0').css('background-size','contain')}else{$el.attr('src',src)}};settings.callback.call(this);$els.each(function(){var $el=$(this);var src=$el.attr('src');if(src){if(!$el.data('m1src')){$el.data('m1src',src)}
var replace=function(){if($.hisrc.connectionTestResult){if(isSlowConnection||$.hisrc.bandwidth==='low'||!HDSupport){$el.attr('src',$el.data('m1src'))}else if($.hisrc.bandwidth==='high'&&HDSupport){if(retinaSupport){var image2x=$el.data('2x');if(!image2x){image2x=$el.data('m1src').replace(/\.\w+$/,function(match){return "@2x"+match})}
setImageSource($el,image2x)}else if(settings.srcIsLowResolution){var image1x=$el.data('1x');if(!image1x){image1x=$el.data('m1src').replace(/\.\w+$/,function(match){return "@1x"+match})} setImageSource($el,image1x)}}}};if(speedConnectionStatus!==STATUS_COMPLETE&&!$.hisrc.connectionTestResult){$(document).on('speedTestComplete.hisrc',replace)} else{replace()}}});initSpeedTest();return $els}})(jQuery)