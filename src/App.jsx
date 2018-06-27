import React from 'react';
import Notes from './notes';
import Table from './table';
import Products from './products';
import Home from './home';
import Stats from './stats';
import {Route, Link} from 'react-router-dom';
import { Layout, Menu } from 'antd';
const { Header, Content, Footer } = Layout;

class App extends React.Component {
	render() {
		return (
			<Layout className="layout">
			<Header className="header">
				<Menu
					theme="dark"
					mode="horizontal"
					defaultSelectedKeys={['1']}
					className="menuBar"
				>
					<Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
					<Menu.Item key="2"><Link to="/notes">Notes</Link></Menu.Item>
					<Menu.Item key="3"><Link to="/table">Table</Link></Menu.Item>
					<Menu.Item key="4"><Link to="/stats">Stats</Link></Menu.Item>
				</Menu>
			</Header>
			<Content className="mainContent">
				<div>
					<Route exact path="/" component={Home}/>
					<Route path="/notes" component={Notes}/>
					<Route path="/table" render={() => <Table products={Products} />}/>
					<Route path="/stats" component={Stats}/>
				</div>
			</Content>
			<Footer className="footer">
				My Design ©2018 Created by <a href="https://github.com/AndrewStrelnik">Andrew</a>
			</Footer>
			</Layout>
		)
	}
}
export default App;