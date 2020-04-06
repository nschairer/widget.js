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
    this.element = document.createElement(this.props.baseElement || 'div')
    this.element.id = this.id
    this.element.className = this.className
    this.children = props.children
    this.initialized = false
    this.props = props
    this.events = []
    this.render = () => {
           for (let child of this.children) {
               child.render(this.state, this)
            if (!this.initialized) {
                console.log('INITIAL RENDER FOR' + this.id)
                this.element.appendChild(child.element)
                if (child.events.length) {
                    this.events.push(...child.events)
                }
            }
           }
           this.initialized = true
        return this.element
    }
    this.onload = () => {
        for (ce of this.events) {
            console.log(ce)
            document.querySelector('#' + ce[2]).addEventListener(ce[0],e => {
                console.log('linking event for' + ce[2])
                e.preventDefault()
                ce[1]()
                .then(() => {
                    console.log('rerendering')
                    this.render()
                })
            })
        }
        this.props.onload(this.state)
        .then(res => {
            console.log(this.state)
            console.log('FINISHED ONLOAD')
            this.render()
        })
    }
    this.addClickEvent = (id, cb) => {
        document.querySelector('#' + id).addEventListener('click', e => {
            e.preventDefault()
            console.log('clicking')
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
    this.renderCB = render
    this.events = []
    this.render = (props, parentref) => {
        this.parentref = parentref
        // if (!this.props || JSON.stringify(props) !== JSON.stringify(this.props)) {
        //     //This doesn't work maybe have to control state at widget level
        //     //console.log('STATE CHANGE', props, this.props)
        this.props = props//{...props}
        this.element.innerHTML = this.renderCB(this.props, this, this.parentref)
        
        if (!this.initialized) {
            console.log('INITIAL view RENDER')
            this.element = this.element.firstChild
            this.initialized = true
        }
        return true
        // }
        // return false
    }
    this.addEvent = (type, callback) => {
        if (this.initialized) {
            return;
        }
        console.log('added event for ' + this.id)
        this.events.push([type, callback, this.id])
    }
}
