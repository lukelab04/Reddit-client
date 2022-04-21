

class ComponentManager {
    constructor(HeadNodeName) {
        if (typeof(HeadNodeName) != "string") throw new TypeError("Expected HeadNodeName to be of type string.");
        this.Head = document.querySelector(HeadNodeName);
        this.Children = []
    }

    Clear() {
        this.innerHTML = "";
        this.Children = []
    }

    AddChild(...component) {
        for(let i = 0; i < component.length; i++) {
            if(!(component[i] instanceof Component)) throw new TypeError("Expected component to be of type Component, not " + component[i]);
            this.Children.push(component[i]);
        }
    }

    Render() {
        var ch = this.Head.lastElementChild;

        while(ch) {
            this.Head.removeChild(ch);
            ch = this.Head.lastElementChild;
        }

        for(let i = 0; i < this.Children.length; i++) {
            this.Head.appendChild(this.Children[i].GetRenderedComponent());
        }
    }
}


class Component {
    constructor(Tag, InnerText, ...Body) {
        if (typeof(Tag) != "string") throw new TypeError("Expected Tag to be of type string.");
        if (typeof(InnerText) != "object") throw new TypeError("Expected InnerText to be of type object.");
        this.Tag = Tag;
        this.InnerText = InnerText;
        this.Body = Body;
    }

    AddChild(c) {
        if(typeof(c) != "string" && c instanceof Component == false)
            throw new TypeError("Expected child to be string or Component, not " + typeof(c));

        this.Body.push(c);
    }


    GetRenderedComponent() {
        var elem = document.createElement(this.Tag);
        elem.innerHTML = "";
        
        for(const property in this.InnerText) {
            elem.setAttribute(property, this.InnerText[property]);
        }

        for(let i = 0; i < this.Body.length; i++) {
            if(typeof(this.Body[i]) == "string") {
                elem.innerHTML += this.Body[i];
            }
            else if(this.Body[i] instanceof Component) elem.appendChild(this.Body[i].GetRenderedComponent());
            else throw new TypeError("Expected body element to be a string or Component, not " + this.Body[i]);
        }
        return elem;
    }
}

class Pages {
    constructor() {
        this.Stack = []
    }

    Push(cm, pageloc) {
        if(cm instanceof ComponentManager == false) throw new TypeError("Expected type ComponentManager");
        let obj = Object.assign(Object.create(Object.getPrototypeOf(cm)), cm);
        this.Stack.push([obj, pageloc]);
    }

    Pop() {
        if(this.Stack.length == 0) return null;
        return this.Stack.pop();
    }
}

var PageManager = new Pages();