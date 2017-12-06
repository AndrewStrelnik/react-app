import React from 'react';
import Notes from './notes';
import Table from './table';
import Products from './products';
import Home from './home';
import './App.css';
import {Route, Link, withRouter} from 'react-router-dom';
import { Layout, Menu } from 'antd';
const { Header, Content, Footer } = Layout;

class App extends React.Component {
	render() {
		return (
			<Layout className="layout" style={{height:"100vh"}}>
			<Header style={{ padding: '0 30px'}}>
				<div className="logo" />
				<Menu
					theme="dark"
					mode="horizontal"
					defaultSelectedKeys={['1']}
					style={{ lineHeight: '64px', fontSize: 'large'}}
				>
					<Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
					<Menu.Item key="2"><Link to="/notes">Notes</Link></Menu.Item>
					<Menu.Item key="3"><Link to="/table">Table</Link></Menu.Item>
				</Menu>
			</Header>
			<Content style={{ padding: '0 30px'}}>
				<div style={{ padding: 24 }}>
					<Route exact path="/" component={Home}/>
					<Route path="/notes" component={Notes}/>
					<Route path="/table" render={() => <Table products={Products} />}/>
				</div>
			</Content>
			<Footer style={{ textAlign: 'center' }}>
				My Design ©2017 Created by Andrew
			</Footer>
		</Layout>

		)
	}
}
export default withRouter(App);