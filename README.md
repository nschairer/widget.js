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

//Create a button with a click event to refresh state and rerender widget
//Must set self.id and self.clickEvent
const newsRefreshBtn = new view(function(props, self) {
    self.id = 'newsRefreshBtn'
    self.addEvent('click', async () => {
        const json = await fetch(`api/getnews`)
        const data = await json.json()
        props.data = data.data[0]
    })
    return `<button id="${self.id}">hi</button>`
})

//Create widget to hold views/state
const newsWidget = new widget({
     id: 'newsWidget',
     class: 'newsWidget',
     state: {
        data: []
     },
     children: [
           newsList,
           newsRefreshBtn
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
