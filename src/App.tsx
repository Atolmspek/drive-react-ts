
import { SideBar } from './main/components/SideBar';
import { NavBar } from './main/components/NavBar';
import { Error } from './main/components/Error';
import { FilesTable } from './main/components/Drive/FilesTable';
import { Footer } from './main/components/Footer';
import { ListContainer } from './main/components/Trello/ListContainer';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Board } from './main/components/Conversor/Board';
import { Main } from './main/components/Tetris/components/Main';
import { CalendarMain } from './main/components/Calendar/CalendarMain';
import { Login } from './main/components/Login/Login';
import { Register } from './main/components/Login/Register';
import { isTokenValid } from './main/components/Login/TokenHandler';
import './assets/css/nucleo-icons.css'
import './assets/css/nucleo-svg.css'
import './assets/css/material-dashboard.css'
import './assets/css/main.css'


const handleLogin: any = () => {

  return (
    <Switch>
      <div className='App Site bg-gray-200'>
        <Route path='/' exact>
          <Redirect to='/login' />
        </Route>
        <Route path='/login' exact>
          <Login />
        </Route>

        <Route path='/register'>
          <Register />
        </Route>
        <Route>
         <Error/>
        </Route>
        <Route path='/tetris'>
          <SideBar />
          <Main />
        </Route>
      </div>
    </Switch>
  )
}

const global: any = () => {

  return (
    <div className='App Site bg-gray-200'>
      <Switch>
        <Route path='/' exact>
          <Redirect to='/home' />
        </Route>
        <Route path='/home'>
          <SideBar />
          <FilesTable />
        </Route>
        <Route path='/register'>
          <Register />
        </Route>
        <Route path='/trello'>
          <SideBar />
          <ListContainer />
        </Route>
        <Route path='/conversor'>
          <SideBar />
          <Board />
        </Route>
        <Route path='/tetris'>
          <SideBar />
          <Main />
        </Route>
        <Route path='/calendar'>
          <SideBar />
          <CalendarMain />
        </Route>
        <Route>
        <Error/>
        </Route>
      </Switch>
      <Footer />
    </div>
  );


}


const App = () => {
  return (
    isTokenValid ? global() : handleLogin()
  )
}

export default App;
