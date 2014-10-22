YUI.add(
    "list-builder",
    function(Y, NAME){
        var ListBuilder = Y.namespace('Widgets').ListBuilder = Y.Base.create(
            'ListBuilder',
            Y.Widget,
            [],
            {

                CONTENT_TEMPLATE: '<ul class="list-container"></ul>',
                ITEM_CONTAINER: '<li class="list-item"></li>',
                ITEM_TEMPLATE: '<span class="item-content">{value}</span><span class="item-delete icon-close"></span>',
                ITEM_EDIT_TEMPLATE: '<input class="edit-item" type="text" value="{value}">',

                initializer: function(config){
                    if(config.delimiter){
                        this.set('delimiter', config.delimiter);
                    }
                    if(config.items){
                        this.set('items', config.items);
                    }
                    this.set('validatorFn', config.validatorFn);
                },

                renderUI: function(){
                    var rootNode = this.get('contentBox');
                    this._inputField = Y.Node.create('<input class="enter-item" type="text">');
                    this._inputLI = Y.Node.create('<li></li>');
                    this._inputLI.appendChild(this._inputField);
                    rootNode.appendChild(this._inputLI);
                    this._renderListItems(false);
                },

                _renderListItems: function(userChange){
                    var items = this.get('items');
                    if(items){
                        items.forEach(
                            function(item){
                                this._validateAndInsert(item, null, userChange);
                            },
                            this
                        );
                    }
                },

                bindUI: function(){
                    this.after(
                        'itemsChange',
                        function(evt){
                            if(!(evt.source && evt.source == 'UI')){
                                var itemNodes = this.get('contentBox').all('li.list-item');
                                itemNodes.remove(true);
                                this._renderListItems(false);
                            }
                        },
                        this
                    );

                    this.get('contentBox').delegate(
                        'keypress',
                        function(evt){
                            var keyCode = evt.keyCode;
                            //188 is the key code for ',' (comma)
                            if(String.fromCharCode(keyCode) == this.get('delimiter')){
                                if(this._inputField === evt.target) {
                                    var value = this._inputField.getDOMNode().value;
                                    if(value && value.trim() != '') {
                                        this._validateAndInsert(value, null, true);
                                    }
                                }
                                else{
                                    this._finishEditItem(evt);
                                }
                                evt.preventDefault();
                                evt.stopPropagation();
                            }
                        },
                        'li input',
                        this
                    );

                    this.get('contentBox').delegate(
                        'click',
                        function(evt){
                            this._editItem(evt);
                            evt.stopPropagation();

                        },
                        '.list-item .item-content',
                        this
                    );

                    this.get('contentBox').delegate(
                        'click',
                        function(evt){
                            this._deleteItem(evt.target.get('parentNode'));
                            evt.stopPropagation();
                        },
                        '.list-item .item-delete',
                        this
                    );

                    this.get('contentBox').delegate(
                        'focus',
                        function(evt){
                            //A hack to put the cursor at the end of the input field
                            this.set('value', this.get('value'));
                        },
                        'input.edit-item'
                    );

                    this.get('contentBox').delegate(
                        'blur',
                        function(evt){
                            this._finishEditItem(evt);
                        },
                        'input.edit-item',
                        this
                    );

                    this.get('contentBox').on(
                        'click',
                        function(evt){
                            if(evt.target === this.get('contentBox')) {
                                this._inputField.focus();
                            }
                        },
                        this
                    );
                },

                _editItem: function(evt){
                    var item = evt.target;
                    var inputNode = Y.Node.create(Y.Lang.sub(this.ITEM_EDIT_TEMPLATE, {value: item.getHTML()}));
                    //inputNode.setAttribute('value', item.getHTML());
                    var liNode = item.get('parentNode');
                    liNode.empty();
                    liNode.removeClass('list-item');
                    liNode.appendChild(inputNode);
                    inputNode.focus();
                },

                _deleteItem: function(node){
                    var parent = node.get('parentNode');
                    var index = parent.get('children').indexOf(node);

                    var currentValue = this.get('items');
                    currentValue.splice(index, 1);
                    this.set('items', currentValue, {source: 'UI'});
                    node.remove();


                    this._refreshValidState();
                },

                _finishEditItem: function(evt){
                    var inputNode = evt.target;
                    var inputValue = inputNode.getDOMNode().value;
                    var liNode = inputNode.get('parentNode');
                    if(inputValue.trim() == ''){
                        _deleteItem(liNode);
                    }
                    this._validateAndInsert(inputValue, liNode, true);
                },

                _validateAndInsert: function(value, liNode, userChange){
                    var validator = this.get('validatorFn');
                    var currentValue = this.get('items').slice();

                    if(!liNode) {
                        liNode = Y.Node.create(this.ITEM_CONTAINER);
                        this.get('contentBox').insert(liNode, this._inputLI);
                        this._inputField.set('value', '');
                        currentValue.push(value);
                    }
                    else{
                        liNode.empty();
                        liNode.addClass('list-item');
                        var index = liNode.get('parentNode').get('children').indexOf(liNode);
                        currentValue.splice(index, 1, value);

                    }
                    liNode.append(Y.Lang.sub(this.ITEM_TEMPLATE, {value: value}));

                    if(userChange) {
                        this.set('items', currentValue, {source: 'UI'});
                    }

                    if(validator &&  validator.apply(this, [value]) !== true){
                        liNode.addClass("invalid");
                        this.set('valid', false);
                    }

                },


                _refreshValidState: function(){
                    var liNodeList = this.get('contentBox').all('li.list-item.invalid');
                    if(liNodeList.size() > 0){
                        this.set('valid', false);
                    }
                    else{
                        this.set('valid', true);
                    }
                }
            },
            {
                ATTRS: {
                    delimiter: {
                        value: ','
                    },
                    validatorFn: {},
                    items: {
                        value: []
                    },
                    valid: {
                        value: true
                    }
                }

            }

        );
    },
    "1.0.0",
    {
        requires: [
            'base',
            'node',
            'widget',
            "event-key"
        ]
    }
);