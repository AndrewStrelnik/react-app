import React, { Component } from 'react';
import axios from 'axios';
import { Form, Icon, Input, Select, Button, Tabs, List, Switch, Row, Col, Card } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class StatsForm extends Component {
	constructor(props){
			super(props);
			this.handleSubmit = this.handleSubmit.bind(this);
		}
	componentDidMount() {
		// To disabled submit button at the beginning.
		this.props.form.validateFields();
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
			}
		})
	}
	render() {
		const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
		// Only show error after a field is touched.
		const userNameError = isFieldTouched('userName') && getFieldError('userName');
		return (
			<Form layout="horizontal" onSubmit={this.handleSubmit} style={{maxWidth:"250px", minWidth:"150px"}}>
				<FormItem
					label="Username"
					validateStatus={userNameError ? 'error' : ''}
					help={userNameError || ''}
				>
				<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} 
				onChange={this.props.handleName}
				placeholder="Enter the Username" />
				</FormItem>
				<FormItem
					label="platform"
				>
					<Select 
					defaultValue="uplay" 
					onChange={this.props.handlePlatform} 
					value={this.props.platform}>
						<Option value="uplay">uplay</Option>
						<Option value="ps4">ps4</Option>
						<Option value="xbox">xbox</Option>
					</Select>
				</FormItem>
				
				<FormItem>
					<Button
						style={{ margin: '10px'}}
						type="primary"
						htmlType="submit"
						onClick={this.props.handleRequest}
					>
						Search
					</Button>
					<Button
						style={{ margin: '10px'}}
						type="primary"
						htmlType="submit"
						onClick={this.props.handleReset}
					>
						Reset
					</Button>
				</FormItem>
			</Form>
		);
	}
}

const Stats = Form.create()(StatsForm);

class Results extends Component {
	constructor(props){
		super(props);
			this.state = {
				error: null,
				isLoaded: false,
				playerStats: {}
			}
	}
	componentDidMount(){
		axios.get(`https://api.r6stats.com/api/v1/players/${this.props.name}?platform=${this.props.platform}`)
		.then(response => {
			this.setState({ 
				isLoaded: true,
				playerStats: response.data.player.stats,
				})
			console.log(this.state.playerStats);
		})
		.catch(error => {
			console.log(error);
			this.setState({
				isLoaded: true,
				error
			})
		})
	}
	render(){
		const { error, isLoaded, playerStats } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
		return(
			<Tabs defaultActiveKey="1" >
				<TabPane tab="Overall" key="1"><EveryStat stat={this.state.playerStats.overall} /></TabPane>
				<TabPane tab="Casual" key="2"><EveryStat stat={this.state.playerStats.casual} /></TabPane>
				<TabPane tab="Ranked" key="3"><EveryStat stat={this.state.playerStats.ranked} /></TabPane>
			</Tabs>
		);
		}
	}
}

function EveryStat (props){
	let AllStat = [];
	for (let key in props.stat) {
		if (key!=="has_played"){
			AllStat.push(`${key.replace( /_/g, " " )} : ${props.stat[key]}`);
		}
	}
	return <List
					bordered
					dataSource={AllStat}
					renderItem={item => (<List.Item>{item}</List.Item>)}
				/>;
}

class StatsField extends Component {
	constructor(props){
		super(props);
		this.state = {
			name:'',
			platform: 'uplay',
			showResult: false,
		}
		this.handlePlatform = this.handlePlatform.bind(this);
		this.handleName = this.handleName.bind(this);
		this.handleRequest = this.handleRequest.bind(this);
		this.handleReset = this.handleReset.bind(this);
	}
	handleName = (e) => {
		let name = e.target.value;
		this.setState({ name })
	}
	handlePlatform  = (value) => {
		let platform = value;
		this.setState ({ platform });
	}
	handleRequest = () => {
		this.setState({
			showResult: true
		})
	}
	handleReset = () => {
		this.setState({
			showResult: false
		})
	}
	render() {
		return (
			<Card title="Player stats" className="statsField" >
				<Stats handleReset={this.handleReset}
				handleRequest={this.handleRequest}
				handlePlatform={this.handlePlatform}
				handleName={this.handleName}
				platform={this.state.platform}/>
				{this.state.showResult ? <Results name={this.state.name} platform={this.state.platform}/> :''}
			</Card>
		);
	}
}

class LeaderBoard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			leaderBoard: []
		}
	}
	componentDidMount(){
		axios.get(`https://api.r6stats.com/api/v1/leaderboards/ranked`)
		// ?platform=uplay
		.then(response => {
			this.setState({
				isLoaded: true,
				leaderBoard: response.data.players,
				})
			console.log(response.data);
		})
		.catch(error => {
			console.log(error);
			this.setState({
				isLoaded: true,
				error
			})
		})
	}
	render() {
		const { error, isLoaded, leaderBoard } = this.state;
				
		if (error) {
		return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
		return <div>Loading...</div>;
		} else {
		const leaderBoardData = [];
		leaderBoard.forEach(function(item) {
			leaderBoardData.push( `${item.username} (${item.platform})` );
		});
		return (
			<div className="leaderBoard">
				<List
					bordered
					header={<h3>Leaderboard</h3>}
					size="small"
					dataSource={leaderBoardData}
					renderItem={item => (<List.Item>{item}</List.Item>)}
				/>
			</div>
		);
		}
	}
}


class StatsPage extends Component {
	constructor (props){
		super(props);
		this.state = {
			compare: false
		}
		this.handleCompare = this.handleCompare.bind(this);
	}
	handleCompare = (checked) => {
		this.setState ({ compare: checked });
	}
	render(){
		return(
			<div className="stats">
			<Row>
				<Col span={24}>
					<div className="compareDiv"><Switch onChange={this.handleCompare} /> <span>Comparing players</span></div>
				</Col>
			</Row>
			<Row gutter={40} type="flex" justify="start">
				<Col xs={24} sm={12} md={8} lg={8} xl={8} className="field"><StatsField /></Col>
				{this.state.compare ? <Col xs={24} sm={12} md={8} lg={8} xl={8} className="field"><StatsField /></Col> :''}
				<Col xs={24} sm={12} md={8} lg={8} xl={6} className="field"><LeaderBoard /></Col>
			</Row>
			</div>
		);
	}
}

export default StatsPage;