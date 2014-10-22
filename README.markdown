# A JavaScript List Builder widget
The list builder gives you a nice input widget for the users to enter a list of values. The widget supports the following features:
- Editing an individual entry
- Deleting an individual entry
- Validating and highlighting an invalid entry
![alt tag](https://raw.github.com/henry0sue/ListBuilder/master/screenshot/ListBuilder.png)

## Usage
Include the following block of code to use the widget
```javascript
<script src="http://yui.yahooapis.com/3.18.1/build/yui/yui-min.js"></script>
<script>
    YUI(
            {
                debug: true,
                filter: 'raw',
                groups: {
                    localjs: {
                        base: "src/",
                        modules: {
                            "list-builder": {
                                path: 'list-builder.js',
                                requires: [
                                    'base',
                                    'node',
                                    'widget',
                                    "event-key"
                                ]
                            }

                        }
                    }
                }
            }
    ).use(
            'list-builder',
            function(Y){
                var listInput = new Y.Widgets.ListBuilder();                
                listInput.render(Y.one('#list-value-input'));
            }
    );
```

