import AppController from './src/controllers/app-controller.js';
import JSONDBService from './src/services/jsondb-service.js';

const db = await new JSONDBService('db');
const app = new AppController();
app.run();


/* 
Epoch date 	Human-readable date (GMT) 
1679546015	2023-03-23 04:33:35
1679546246	2023-03-23 04:37:26
1679549205	2023-03-23 05:26:45
*/

/* 
  C:\Users\nicol\Desktop\AppLogs_2023-03-28_14-43-08\Apps\Valorant Tracker\background.html.log
  data -> game -> profile -> matches -> competitive
*/