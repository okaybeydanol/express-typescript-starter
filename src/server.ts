import App from '@/app';
import IndexRoute from '@routes/index.route';
import AuthRoute from '@routes/auth.route';

const app = App([IndexRoute, AuthRoute]);

app.listen();
