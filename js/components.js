

function NavBar() {
    return new Component(
        "div", 
        {
            'class' : 'HeadNav',
        }, 
        new Component(
            "h3", {'class' : 'NavBarItem'}, "Menu"
        ), 
        new Component(
            "h3", {'class' : 'NavBarItem'}, "Home"
        ), 
        new Component(
            "h3", {'class' : 'NavBarItem'}, "Search"
        )
    );
}

async function CommentView(url) {

    let data = await RedditManager.GetComments(url);
    data = data[1];

    return new Component(
        "div",
        {'class' : 'CommentParent'},
        new Component (
            "button",
            {'class' : 'NavButton', 'style' : 'width: 100px; margin: 10px;', 'onclick' : 'CommentBack()'},
            "Back"
        ),
        CommentList(data['data'])
    )

    function CreateBasicComment(element, indentation = 0) {
        //Expects element to be object, with kind and data as top level
        return new Component(
            "div",
            {"class" : "CommentContainer", 'style' : 'margin-left: ' + (indentation * 5).toString() + 'px'},
            new Component(
                "div",
                {'class' : "CommentAuthScoreContainer"},
                new Component(
                    "p", {"class" : "CommentAuthScore"}, 
                    element['data']['author']
                ),
                new Component(
                    "p", {"class" : "CommentAuthScore"},
                    element['data']['score'].toString()
                )
            ),
            new Component (
                "p",
                {'class' : 'CommentBody'},
                element['data']['body']
            )
        );
    }
    
    //Elem should be comment object
    function CommentList(element) {
        let commentlist = new Component(
            "div",
            {"class" : "CommentList"}
        )

        for(const i in element['children']) {
            let child = element['children'][i];
            if(child['kind'] == 'more') break;
            let comment = CreateBasicComment(child);
            if(child['data']['replies'] != undefined && child['data']['replies'] != '') {
                AddChildComments(child['data']['replies'], comment);
            }
            commentlist.AddChild(comment);
        }

        return commentlist;
    }

    function AddChildComments(replies, comment, indentation = 1) {
        for(const i in replies['data']['children']) {
            let child = replies['data']['children'][i];
            if(child['kind'] == 'more') break;
            let childcomment = CreateBasicComment(child, indentation);
            if(child['data']['replies'] != '') {
                AddChildComments(child['data']['replies'], childcomment, indentation + 1);
            }
            comment.AddChild(childcomment);
        }
    }
}

async function PostList(next = true) {
    let data = null;
    if(next == true) data = await RedditManager.GetNextPage();
    else data = await RedditManager.GetPreviousPage();

    let postlist = new Component("div",{"class" : "PostList"});

    for(let i = 0; i < data["data"]["children"].length; i++) {
        let elem = data["data"]["children"][i]["data"];
        postlist.AddChild(CreatePost(elem));
    }
    
    function CreatePost(element) {
        //Text
        if(element["post_hint"] == "self" || element["is_self"] == true) {
            return TextPost(element);
        }

        //Link
        else if(element["post_hint"] == "link") {
            return LinkPost(element);
        }

        else if(element["post_hint"] == "image") {
            return ImagePost(element);
        }
        
        else if(element["post_hint"] != undefined && element["post_hint"].includes("video")) {
            return VideoPost(element);
        }

        else {
            return new Component(
                "div",
                {},
                "Unknown"
            );
        }
    }


    function BasicPost(element) {
        return new Component(
            "div",
            {"class" : "Post", "posturl" : element['permalink']},
            new Component (
                "div",
                {"class" : "PostAuthorSub"},
                new Component(
                    "p",
                    {"class" : "PostAuthorSubText"},
                    element["subreddit_name_prefixed"]
                ),
                new Component(
                    "p",
                    {"class" : "PostAuthorSubText"},
                    element["author"],
                ),
            ),
            new Component (
                "p",
                {"class" : "PostTitle"},
                element["title"],
            )
        );
    }

    function PostFooter(element, post) {
        post.AddChild(new Component(
            "div", 
            {"class" : "PostFooter", "onclick" : "ClickedPost(this)"},
            new Component(
                "p",
                {"class" : "PostUpvotes"},
                element["ups"].toString()
            ),
            new Component(
                "p",
                {"class" : "PostComments"},
                element['num_comments'].toString()
            )
        ));
    }

    function TextPost(element) {
        let base = BasicPost(element);
        base.AddChild(new Component(
            "p",
            {"class" : "TextPostBody", "style": "white-space: pre-line;"},
            element["selftext"]
        ));
        PostFooter(element, base)
        return base;
    }

    function LinkPost(element) {
        base = BasicPost(element);
        base.AddChild(new Component(
            "a",
            {"class" : "LinkBodyContainer", "href" : element["url"], "target" : "_blank"},
            new Component(
                "img", 
                {"src" : element["thumbnail"], "class" : "LinkImage"}
            )
        ));
        PostFooter(element, base);
        return base;
    }

    function ImagePost(element) {
        base = BasicPost(element);
        base.AddChild(new Component(
            "img",
            {"src" : element["url"], "class" : "ImagePostImage", "referrerpolicy" : "no-referrer"},
        ))
        PostFooter(element, base);
        return base;
    }

    function VideoPost(element) {
        let base = BasicPost(element);

        if(element["post_hint"] == "hosted:video") {
            base.AddChild(new Component(
                "video",
                {"controls" : null, "class" : "VideoPost"},
                new Component(
                    "source",
                    {"src": element['media']['reddit_video']['fallback_url']},
                )
            ));
        }
        else {
            base.AddChild(new Component(
                "a",
                {"href" : element['url'], "class" : "VideoLink"},
                "View Gif"
            ))
        }
        PostFooter(element, base);

        return base;
    }

    return postlist;
}

function NavFooter() {
    return new Component (
        "div",
        {"class" : "NavFooter"},
        new Component(
            "button",
            {"class" : "NavButton", "onclick" : "LoadPreviousPage()"},
            "Back"
        ),
        new Component(
            "button",
            {"class" : "NavButton", "onclick": "LoadNextPage()"},
            "Next"
        ),
    )
}