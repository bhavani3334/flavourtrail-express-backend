# FlavourTrail - Express Backend (Starter)


This repository is a starter template built with Node/Express + MongoDB. It implements:


- JWT user authentication (register/login)
- Role-based authorization (user, owner, admin)
- Restaurant model with GeoJSON location for geospatial queries
- Search / filter (by tags, price, keyword, location)
- Menu CRUD for owners/admin
- External integration endpoints (Google Places, Foursquare) that return merged results with your DB


## Setup
1. Copy files into a new Git repo.
2. Create `.env` from `.env.example` and fill values.
3. `npm install`
4. `npm run dev` (requires nodemon) or `npm start`


## Notes & Next steps
- Add input validation (e.g. express-validator) and rate limiting.
- Harden security and CORS rules for production.
- Add pagination, richer search scoring and caching.
- Consider Elasticsearch for advanced search.
- Add tests and CI.




// END OF SCAFFOLD