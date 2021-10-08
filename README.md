# File Explorer SK

## Table of contents
- [File Explorer SK](#file-explorer-sk)
  - [Table of contents](#table-of-contents)
  - [General info](#general-info)
  - [Technologies](#technologies)
  - [Setup](#setup)
  - [Usage](#usage)

## General info
This project is a file explorer displayed in a tree view format. Directory paths are given as program arguments and their contents are displayed locally in a web browser.

This project was built using vanilla Javascript. A front-end framework might need to be considered for future updates or if theres need to increase the scope of the project. A framework could ease further development and allow more efficient enhancements to the user experience. 
	
## Technologies
Project is created with:
* Node version: 10.15.3
* express version: 4.17.1
* express-ws version: 5.0.2
* fdir version: 5.1.0
	
## Setup
[Node.js](https://nodejs.org/) is required to run.

To setup this project, create a local folder location for the repository and install it locally using npm:

```
$ git clone https://github.com/kligmasn/FileExplorerSK.git
$ cd ./FileExplorerSK
$ npm install 
```

## Usage
To use this project, run the program with node and pass directory paths as additional arguments

For example:
```
$ node file-explorer.js ./testfolder/ D:\Documents\Spring2019
```
