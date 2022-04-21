
let manager = new ComponentManager("body");
RenderPage();

async function RenderPage(next = true) {
    let p = await PostList(next);
    manager.AddChild(NavBar(), NavFooter(), p, NavFooter());
    manager.Render();
    window.scrollTo({top: 0});
}

async function RenderComments(url) {
    let c = await CommentView(url);
    manager.AddChild(NavBar(), c);
    manager.Render();
    window.scrollTo({top: 0});
}

function LoadNextPage() {
    manager.Clear();
    RenderPage();
}

function LoadPreviousPage() {
    manager.Clear();
    RenderPage(false);
}

function ClickedPost(event) {
    PageManager.Push(manager, window.scrollY);
    manager.Clear();
    RenderComments(event.parentElement.attributes.posturl.value);
}

function CommentBack() {
    let tmp = PageManager.Pop();
    if (tmp == null) manager = null;
    else {
        manager = tmp[0];
        window.scrollTo({top: tmp[1]});
    }

    if(manager == null) {
        manager = new ComponentManager('body');
        RenderPage();
    }
    else {
        manager.Render();
    }
}