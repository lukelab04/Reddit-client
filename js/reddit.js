
class Reddit {
    constructor() {
        this.Stack = []
        this.currentSub = 'askreddit';
    }

    async GetNextPage() {
        let url = "";
        if(this.Stack.length == 0) url = "https://api.reddit.com/r/" + this.currentSub + ".json";
        else url = "https://api.reddit.com/r/" + this.currentSub + ".json?after=" + this.Stack[this.Stack.length - 1];
        let result = await fetch(url);
        let json = await result.json();
        this.Stack.push(json['data']['after']);
        return json;
    }

    async GetPreviousPage() {
        if(this.Stack.length > 0) this.Stack.pop();
        let url = "";
        if(this.Stack.length == 0) url = "https://api.reddit.com/r/" + this.currentSub + ".json";
        else url = "https://api.reddit.com/r/" + this.currentSub + ".json?after=" + this.Stack[this.Stack.length - 1];
        let result = await fetch(url);
        let json = await result.json();
        return json;
    }

    async GetComments(url) {
        let result = await fetch("https://api.reddit.com" + url + ".json");
        let json = await result.json();
        return json;
    }
}

const RedditManager = new Reddit();