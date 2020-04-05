// Developer: Noah Schairer
// Version: 1.0
// Last Update: 4/4/2020
// Purpose: State based reactive UI in vanilla JS


/**
 * Represents a widget
 * @constructor
 * @param {Object} props - Object containing widget information
 * @param {string} props.id - Object id 
 * @param {string} props.className - Object class name
 * @param {Object} props.state - State specific to widget
 * @param {Array} props.children - Children views to be rendered'
 * @param {function props.onload(state) {}} - onload function to run after initial render 
 */
function widget(props){
    this.id = props.id || ''
    this.className = props.class || ''
    this.state = props.state
    this.element = document.createElement('div')
    this.element.id = this.id
    this.element.className = this.className
    this.children = props.children
    this.initialized = false
    this.props = props
    this.render = () => {
           for (let child of this.children) {
               child.render(this.state)
            if (!this.initialized) {
                console.log('INITIAL RENDER FOR' + this.id)
                this.element.appendChild(child.element)
            }
           }
           this.initialized = true
        return this.element
    }
    this.onload = () => {
        this.props.onload(this.state)
        .then(res => {
            console.log(this.state)
            console.log('FINISHED ONLOAD')
            this.render()
        })
    }
}


/**
 * Represents a container for widget management
 * @constructor
 * @param {string} id - id of container DOM element 
 */
function container(id) {
    this.main = document.querySelector('#' + id)
    this.children = []
    this.add = (customWidget) => {
        this.children.push(customWidget)
        this.main.appendChild(customWidget.render())
        customWidget.onload()
    }
    this.refresh = (id) => {
        const toUpdate = this.children.findIndex(c => c.id === id)
        console.log(this.children, this.main)
        this.children[toUpdate].render()
    }
    this.remove = (id) => {
        const popped = this.children.splice(this.children.findIndex(c => c.id === id))[0]
        this.main.removeChild(popped.element)
    }
}


/**
 * Represents a view
 * @constructor
 * @param {function} render - render method to load ui elements into view 
 */
function view (render) {
    this.props = null
    this.element = document.createElement('div')
    this.initialized = false
    this.render = (props) => {
        // if (!this.props || JSON.stringify(props) !== JSON.stringify(this.props)) {
        //     //This doesn't work maybe have to control state at widget level
        //     //console.log('STATE CHANGE', props, this.props)
        this.props = {...props}
        this.element.innerHTML = render(this.props)
        if (!this.initialized) {
            console.log('INITIAL view RENDER')
            this.element = this.element.firstChild
            this.initialized = true
        }
        return true
        // }
        // return false
    }
}
