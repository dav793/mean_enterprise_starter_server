
# Back-End Style Guide

## Folder structure

Structure your solution by components. That is, divide the whole stack into self-contained components that don't share files with others, each constitutes very few files (e.g. API, service, data access, test, etc.) so that it's very easy to reason about it.

Assign a folder in your project for each business component and make it self-contained - other components are allowed to consume its functionality only through its public interface or API.

## Naming conventions

* Folders & files > dash-case
* Variables & functions > camelCase
* Classes & interfaces > TitleCase

## Layer your components

Each component should contain 'layers' - a dedicated object for the web, logic services, and data access code. This not only draws a clean separation of concerns but also significantly eases mocking and testing the system.

Keep Express in the **web layer only**.

## Use async/await to catch errors. Do not use callbacks.

Callbacks force us to deal with nasty code nesting and they make it difficult to reason about the code flow.

**Do** this:
```javascript
    async function executeAsyncTask() {
        try {
            const value = await functionA();
            return await functionB();
        }
        catch(err) {
            logger.error(err);
        }
    }
```

**Do not** do this:
```javascript
    getData(function(err, result) {
       if (!err) {
           getMoreData(function(err, result) {
               if (!err) {
                   proccessData(function(err, result) {
                       // ...
                   });
               }
           });
       } 
    });
```

## When throwing errors, use only the build-in Error object

Avoid using strings or custom types when throwing errors. Using only the built-in Error object will increase uniformity and prevent loss of information.

## Handle errors centrally

Error handling logic (such as logging) should be encapsulated in a dedicated and centralized object that all endpoints (Express middleware, cron jobs, unit tests, etc) call when an error is produced.

Do not handle errors directly within an Express middleware.

## 

## Extra
* [Follow Node Best Practices](https://github.com/i0natan/nodebestpractices)

