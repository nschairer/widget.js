# widget.js
State based reactive UI library in vanilla js
```javascript
//View helper function
const newsItem = item => {
   return `<li>${item.title}, ${item.publishdate}</li>`
}

//Create view to be updated with state
const newsList = new view(({data}) => {
    let list = '<ul class="newsList">'
    for (let article of data) {
         list += newsItem(article)
    }
    return list + '</ul>'
})

//Create widget to hold views/state
const newsWidget = new widget({
     id: 'newsWidget',
     class: 'newsWidget',
     state: {
        data: []
     },
     children: [
           newsList
     ],
     onload: async (state) => {
     const json = await fetch(`api/getnews`)
             const data = await json.json()
             state.data = data.data
     }
})
//Add widget to application
const app = new container('app')
app.add(newsWidget)
```
