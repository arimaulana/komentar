# Komentar

This app is used for commenting system in the static site using typescript.

Why using TypeScript? Two basic reason, I just want a simple environment for this project which good to go for the API and Frontend part. The last one is, I've done enough of NodeJS and want to explore more about OOP.

## Commenting System Design

- As a reader, I want to be able to view comments in the article
- As a reader, I want to be able to comment in the article
- As a reader, I want to be able to comment on an existing comment in the article
- As an admin, I want to be able to view all comments
- As an admin, I want to be able to update an existing comment
- As an admin, I want to be able to delete a comment
- As an admin, I want to be able to hide or show an existing comment

### Issues
- Cannot interface injecting due to language limitation. 
    https://github.com/nestjs/nest/issues/43#issuecomment-300092490

### Reference

- https://www.taniarascia.com/add-comments-to-static-site/
- https://www.baeldung.com/hexagonal-architecture-ddd-spring
