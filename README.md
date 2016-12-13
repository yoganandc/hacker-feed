# hacker-feed
A single page web application where users can view, save, and share posts from Hacker News.

## # Features

### 1. Home

#### Board

The hacker-feed **board** is the landing page when you login. It contains a stream of posts saved by or shared with the user in 
reverse chronological order (most recent being the topmost post). You can click on the posts to view the articles (which open in
a new tab/window), and click on the comments icon to view comments posted on Hacker News.

#### HN Top

This is a tab on the homepage which displays the current front page posts on Hacker News. For each post, you have the option to open 
the post by clicking on its link, view its comments, save the post, and share the post with your friends.

#### HN Best

This is a tab on the homepage which displays the highest-voted recent posts on Hacker News. For each post, you have the option to open 
the post by clicking on its link, view its comments, save the post, and share the post with your friends.

#### HN New

This is a tab on the homepage which displays the newest posts on Hacker News. For each post, you have the option to open 
the post by clicking on its link, view its comments, save the post, and share the post with your friends.

---

### 2. Comments

This page shows you the comments on Hacker News for a single post. You can also choose to save the post or share the post
with any of your friends from this page.

---

### 3. Account

#### Register

Register for an account on the hacker-feed website by entering a username and password. Users who create their account via this
page will have to login with these credentials every time. If you want to be able to login via Facebook, then do not register 
for an account here. Click on the login via Facebook link on the login page directly to have an account created for you.

#### Login

The hacker-feed website allows you to login directly or via Facebook. Logging in via Facebook for the first time creates an account
for you with your username set to your email address (that you use on Facebook). You can login directly even if you create your
account by logging in via Facebook by setting a password on the profile page.

#### Profile

Your profile page shows you information about your account including your username, first name, last name, and email. Your username
cannot be changed. Your password is not shown to you but can be changed by entering one in and clicking update.

#### Logout

Click on the logout link at the top right of all pages (once you've logged in) to logout easily.

---

### 4. Friends

#### List

This tab (on the friends page) shows you a list of all your friends. You can click on the link to view their profile and
board.

#### Requests Received

This tab (on the friends page) shows you a list of all users you've received a friend request from. You can click on the 
link to view their profile. Click on the accept button to accept their friend request.

#### Requests Sent

This tab (on the friends page) shows you a list of all users you've sent a friend request to. You can click on the link to 
view their profile.

#### Search

This tab (on the friends page) enables you to search for users of the hacker-news website. The list of results will show all users
whose username, first name, or last name contained your query. You can click on the link to view their profile.

---

### 5. User

#### Board

On this tab you can see this user's board which contains a list of all the posts this user saved or shared with this user. You
cannot view this content unless you are a friend of this user.

#### Profile

The profile page shows you information about this user including their username, first name, last name, and email.

### 6. Admin

Admin accounts are accounts have all of the features regular accounts have. In addition, they also can update, and delete 
other accounts. They can also create new admin accounts.

#### Search

This tab enables you to search for users of the hacker-news website. The list of results will show all users whose username, 
first name, or last name contained your query. You can click on the link to view their profile. You can also click on the edit
icon to edit the user's details and also delete their account.

#### Create/View

This tab shows a list of all other admins users registered. You can also create new admin users on this tab. Note that 
all accounts created here will be admin accounts. If you want to create a regular account, use the register page.

## # Front-End Implementation

The hacker-feed website is a responsive single web application that makes use of Bootstrap (CSS), FontAwesome (icons), 
jQuery(Bootstrap dependency), and AngularJS (JavaScript).

### Services

1. **UserService:**  makes requests to the *User* resource of the hacker-feed API. 
1. **ItemService:** makes requests to the *Item* resource of the hacker-feed API.
1. **HackerNewsService:** makes requests to the (third party) [Hacker News API](https://github.com/HackerNews/API).

### Controllers

There are six top level controllers (one for each of the features).

1. **HomeController:** controls posts on the user's board, and shows Hacker News top, best, and new posts.
1. **CommentController:** shows comments from Hacker News for a post.
1. **AccountController:** controls user registration, login, logout, and profile.
1. **FriendController:** controls user's friends, requests received, requests sent, and searching for users.
1. **UserController:** shows a user's board (if they are a friend) and the user's profile.
1. **AdminController:** controls admin operations and shows list of admin users.

## # Back-End Implementation

The hacker-feed API is RESTful API that makes use of Express, Mongoose, and Passport to implement two resources:

1. **Users:** A user object contains basic account information, IDs of the user's friends, and IDs of posts shared with the user
or the user saved.
2. **Items:** An item object consists of the Hacker News post ID, the user ID the item belongs to, and an (optional) 2nd user ID
which is the ID of the user who shared the item.
