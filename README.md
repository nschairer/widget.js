# widget.js
State based reactive UI library in vanilla js
```javascript
const newsItem = item => {
   return `<li>${item.title}, ${item.publishdate}</li>`
}

const newsList = new view(({data}) => {
    let list = '<ul class="newsList">'
    for (let article of data) {
         list += newsItem(article)
    }
    return list + '</ul>'
})


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
     const app = new container('app')
     app.add(newsWidget)
})
```
