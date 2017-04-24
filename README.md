# event-listen
自定义事件

# Install
```
   npm install --save-dev event-listen

```

# Examples
```js
   var Event = require('event-listen'); 

   Event.on('test:event', function (obj) {
    console.log(obj);
   })

   Event.trigger('test:event', { name : 'event-listen'})

```