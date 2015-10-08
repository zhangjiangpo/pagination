/**
 * Created by zhangjiangpo on 2015/10/6.
 */
(function($){
    var defaultData={
            position:'right',//分页位置left center right
            startPage:1,
            pageCount:0,//总共分几页
            pageSliderCount:5,//显示多少个页码
            btnShow:true,//上一页、下一页按钮是否显示
            btnCallback: function (ev) {//ev.curIndex 当前页码

            }
        },
        page=null,datakey='pagination';
    $.fn.pagination=function(opt){//ajax列表改变搜索条件后页码信息改变，重新初始化页码组件
        if(!$(this).data(datakey)){
            page=new pagination(opt,$(this));
            publicFn($(this),page);
            $(this).data(datakey,page);
        }else{
            //触发自定义方法
            $(this).trigger('defaulDataReset',opt);//重置初始化参数
            $(this).trigger('pagesReset');//重置页码html
        }
    }
    //分页构造函数
    function pagination(opt,$this) {
        this.$this=$this;
        this.setting= $.extend({},defaultData,opt);
        this.init();
    }
    pagination.prototype= function () {
        return {
            init:function(){
                var pageCon=this.$this;
                switch(this.setting.position){
                    case 'left':pageCon.css({'left':'0'});break;
                    case 'center':;
                    case 'right':pageCon.css({'right':'0'});break;
                }
                this.htmlInit();
                this.eventBind();
            },
            defaulDataReset: function (opt) {//重置初始化参数
                this.setting= $.extend({},defaultData,opt);
            },
            htmlInit: function () {
                var html='<a href="javascript:void(0);" class="pre-page '+(this.setting.startPage==1?'btn-enabled':'')+'">上一页</a>'+
                    '<p class="pages-con">'+this.pagesHtml(this.setting.startPage)+
                    '</p><p class="j-container"><input class="jump-topage"><a href="javascript:void(0);" class="jump-btn">跳转</a></p>'+
                    '<a href="javascript:void(0);" class="next-page '+(this.setting.startPage==this.setting.pageCount?'btn-enabled':'')+'">下一页</a>';
                this.$this.html(html);
            },
            pagesHtml: function (index,pageCount,pageSliderCount) {//页码核心算法 左中右情况判断
                var htmls=[],i=1;
                pageCount=pageCount?pageCount:this.setting.pageCount;
                pageSliderCount=pageSliderCount?pageSliderCount:this.setting.pageSliderCount;
                if(pageCount<=pageSliderCount+2){
                    for(;i<=pageCount;i++){
                        htmls.push(i==index?('<span class="active">'+i+'</span>'):('<span>'+i+'</span>'));
                    }
                }else{
                    if(index>=5&&index<pageCount-3){//当页码在中间时
                        htmls.push('<span>1</span><i>...</i>');
                        for(i=index-2;i<=index+2;i++){
                            htmls.push(i==index?('<span class="active">'+i+'</span>'):('<span>'+i+'</span>'));
                        }
                        htmls.push('<i>...</i><span>'+pageCount+'</span>');
                    }else if(index<5){//当页码在左边时
                        var max=5;
                        if(index==4&&i==4)max++;
                        for(;i<=max;i++){
                            htmls.push(i==index?('<span class="active">'+i+'</span>'):('<span>'+i+'</span>'));
                        }
                        htmls.push('<i>...</i><span>'+pageCount+'</span>');
                    }else if(index>=pageCount-3){//当页码在右边时
                        var max=4;
                        htmls.push('<span>1</span><i>...</i>');
                        if(index==pageCount-3&&i==pageCount-3)max++;
                        for(i=pageCount-max;i<=pageCount;i++){
                            htmls.push(i==index?('<span class="active">'+i+'</span>'):('<span>'+i+'</span>'));
                        }
                    }
                }
                return htmls.join('');
            },
            pagesReset:function(curindex,pageCount,pageSliderCount){//重置页码 比如搜索条件改变，页码信息改变
                var index=curindex?curindex:this.setting.startPage;
                if(index==1){
                    this.$this.find('.pre-page').addClass('btn-enabled');
                }else if(index==this.setting.pageCount){
                    this.$this.find('.next-page').addClass('btn-enabled');
                }else{
                    this.$this.find('.pre-page').removeClass('btn-enabled');
                    this.$this.find('.next-page').removeClass('btn-enabled');
                }
                this.$this.find('.pages-con').html(this.pagesHtml(index,pageCount,pageSliderCount));
                curindex?this.setting.btnCallback({'curIndex':index}):'';//初始化不调用page change回调
            },
            eventBind: function () {//事件绑定
                var _this=this;
                this.$this.find('.pages-con').on('click','span', function (ev) {
                    ev=ev||window.event;
                    var tar=ev.target||ev.srcElement;
                    var index=parseInt($(tar).html());
                    _this.pagesReset(index);
                });
                this.$this.find('.jump-btn').on('click', function () {
                    var index=parseInt(_this.$this.find('.jump-topage').val());
                    _this.pagesReset(index);
                });
                this.$this.find('.pre-page').on('click',function(){
                    if($(this).hasClass('btn-enabled'))return false;
                    var index=parseInt(_this.$this.find('.pages-con').children('.active').html());
                    _this.pagesReset(index-1);
                })
                this.$this.find('.next-page').on('click',function(){
                    if($(this).hasClass('btn-enabled'))return false;
                    var index=parseInt(_this.$this.find('.pages-con').children('.active').html());
                    _this.pagesReset(index+1);
                })
            }
        }
    }()
    function publicFn($obj,obj){//对外开发接口
        var publicFn=['defaulDataReset','pagesReset'];
        for(var i=0;i<publicFn.length;i++){
            (function(i,o){
                $obj.bind(publicFn[i],function() {//通过自定义事件，将对外接口事件绑定到注册组件的jquery对象上
                    o[publicFn[i]].apply(o, [].slice.call(arguments, 1));//第一个参数是event对象，所以要从第二个开始
                })
            })(i,obj);
        }
    }
})(jQuery)
