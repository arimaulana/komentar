# Komentar

This app is used for commenting system in the static site using typescript.
Note: Its not production ready yet. Still so much improvement in many aspect. Currently its for my learning purpose.

Why using TypeScript? Two basic reason, I just want a simple environment for this project which good to go for the API and Frontend part. The last one is, I've done enough of NodeJS and want to explore more about OOP.

## Commenting System Design

- As a reader, I want to be able to view comments in the article
- As a reader, I want to be able to comment in the article
- As a reader, I want to be able to comment on an existing comment in the article
- As an admin, I want to be able to view all comments
- As an admin, I want to be able to update an existing comment
- As an admin, I want to be able to delete a comment
- As an admin, I want to be able to hide or show an existing comment

## Project Architecture

#### Backend Part
Using hexagonal architecture with simple domain layer (domain business, repository port, service port) and using nestjs for current implementation.


#### Frontend Part
Using webcomponent so it can be as simple as using a html tag in any site. In this part, I'm using webpack to help me develop and bundling into production.

### Milestone
~~- Adding reply feature~~

#### Backend Part
~~- Implement real database repository with TypeORM~~
- Adding authorization to api

#### Frontend Part
- Adding admin site

## Cheatsheet

- `docker-compose up -d`
- `docker-compose down`
- `docker-compsoe up --build -V` # -V argument will remove any anonymous volumes and create them again
- `docker-compoes logs -f <container_name>`


### Issues

#### Backend Part
- Cannot interface injecting due to language limitation. 
    https://github.com/nestjs/nest/issues/43#issuecomment-300092490

#### Frontend Part
- Cannot use this keyword (parent in the code) inside an event handler function. always got an empty object {} when calling straight from shadowRoot.getElementById('the-element-id').value. My current workaround is using calling from the document, but the cons is, I should define the custom element tag again. Hmm yea i know its not elegant, but works.
- Just realized event listener removed after re-render element and in my case, i'm not re-adding event listener (this is my bad habit to use react like in vanilla js which is poorly knowledge about html and js). Solved by adding event listener (only for non-template element event listener) after calling re-render function, In this time, I got a help from using observedAttributes feature.

#### Others (Development, tools, etc)
- after adding npm packages, packages in container not updated even after set docker-compose down and up again, could be fixed by rebuild it again. (Due to we already defined node_modules as an anonymous volume to prevent our host files from overriding the directory)

### Reference


- https://www.taniarascia.com/add-comments-to-static-site/
- https://www.baeldung.com/hexagonal-architecture-ddd-spring
- https://html.spec.whatwg.org/multipage/custom-elements.html
- https://developers.google.com/web/fundamentals/web-components/customelements
- https://developers.google.com/web/fundamentals/web-components/shadowdom
- https://www.thinktecture.com/en/web-components/native-web-components-without-framework/
- https://itnext.io/handling-data-with-web-components-9e7e4a452e6e Handling data with web components (it really open up my mind on variuos way to handle data in web generally)
- https://blog.logrocket.com/containerized-development-nestjs-docker/
