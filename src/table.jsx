import React from 'react';
import { Checkbox, Input, Card, Row, Col} from 'antd';
const { Meta } = Card;

class ProductRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleProduct = this.handleProduct.bind(this);
  }
  
  handleProduct(name){
    this.props.selectProduct(name)
  }
  render() {
    const product = this.props.product;
    const name = product.stocked ?
      product.name :
      <span style={{color: 'red'}}>
        {product.name}
      </span>;
    
    return (
      <tr onClick={()=>this.handleProduct(product.name)}>
        <td>{name}</td>
        <td>${product.price}</td>
      </tr>
    );
  }
}
class ProductTableHeader extends React.Component {
  render() {
    let sortDirArrow = '';
    if (this.props.sortDir !== null){
      sortDirArrow = this.props.sortDir === 'DESC' ? ' ↓' : ' ↑';
    }
    return (
      <thead>
        <tr>
          <th id='name' onClick={this.props.sortChange}>Name {this.props.sortBy === 'name' ? sortDirArrow : ''}</th>
          <th id='price' onClick={this.props.sortChange}>Price {this.props.sortBy === 'price' ? sortDirArrow : ''}</th>
        </tr>
      </thead>
    );
  }
}

class ProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: '',
      sortDir: null,
      products: this.props.products
    };
    this.handleSortChange = this.handleSortChange.bind(this);
  }
  handleSortChange(e){
    let products = this.state.products.slice();

    if (e.currentTarget.id === 'name'){
      this.setState({
        sortBy: 'name'
      })
      products.sort((a, b) => {
        let sortVal = 0;
        if (a.name > b.name) {
          sortVal = 1;
        }
        if (a.name < b.name) {
          sortVal = -1;
        }
        if (this.state.sortDir === 'DESC') {
          sortVal = sortVal * -1;
        }
        return sortVal;
      });
      this.setState({products: products})
    }
    else if (e.currentTarget.id === 'price'){
      this.setState({
        sortBy: 'price'
      })
      products.sort((a, b) => {
        let sortVal = 0;
        if (a.price > b.price) {
          sortVal = 1;
        }
        if (a.price < b.price) {
          sortVal = -1;
        }       
        if (this.state.sortDir === 'DESC') {
          sortVal = sortVal * -1;
        }
        return sortVal;
      });
      this.setState({products: products})
    }
    if ((this.state.sortDir === null) || (this.state.sortDir === 'DESC')){
      this.setState({
        sortDir: 'ASC'
      })
    }
    else if (this.state.sortDir === 'ASC'){
      this.setState({
        sortDir: 'DESC'
      })
    }
  }

  render() {
    const filterText = this.props.filterText;
    const inStockOnly = this.props.inStockOnly;
    const rows = [];
    
    this.state.products.map(
      (product) => {
      if ((product.name.toLowerCase()).indexOf(filterText.toLowerCase())===-1){
        return;
      }
      if (inStockOnly && !product.stocked){
        return;
      }
      rows.push(
        <ProductRow
          product={product}
          key={product.name}
          selectProduct = {this.props.selectProduct}/>
      );
      }
    );

    return (
      <table className="productTable" style={{maxWidth: "700px"}}>
        <ProductTableHeader sortDir={this.state.sortDir} 
        sortBy={this.state.sortBy} 
        sortChange={this.handleSortChange}/>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockChange = this.handleInStockChange.bind(this);
  }
  handleFilterTextChange(e){
    this.props.onFilterTextChange(e.target.value)
  }
  handleInStockChange(e){
    this.props.onInStockChange(e.target.checked)
  }
  render() {
    const filterText = this.props.filterText;
    const inStockOnly = this.props.inStockOnly;
    return (
      <form className="SearchForm">
        <Input placeholder="Search..." style={{ width: 'auto'}} value={filterText} onChange={this.handleFilterTextChange}/>
        <p>
          <Checkbox checked={inStockOnly} onChange={this.handleInStockChange}>
          Only show products in stock
          </Checkbox>
        </p>
      </form>
    );
  }
}

class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      inStockOnly: false,
      activeProduct: 'Google Pixel',
    };
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockChange = this.handleInStockChange.bind(this);
    this.selectProduct = this.selectProduct.bind(this);
  }
  handleFilterTextChange(Text){
    this.setState({
      filterText: Text
    })
  }
  handleInStockChange(Check){
    this.setState({
      inStockOnly: Check
    })
  }
  selectProduct(name){
    this.setState({
      activeProduct: name
    })
  }
  render() {
    return (
      <React.Fragment>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={14} lg={16} xl={14} className="tableField">
        <div className="SearchTable">
          <SearchBar 
            filterText={this.state.filterText}
            inStockOnly={this.state.inStockOnly}
            onFilterTextChange={this.handleFilterTextChange}
            onInStockChange={this.handleInStockChange}
          />
          <ProductTable products={this.props.products}
            filterText={this.state.filterText}
            inStockOnly={this.state.inStockOnly}
            selectProduct = {this.selectProduct}
          />
        </div>
        </Col>
        <Col xs={24} sm={24} md={10} lg={6} xl={6} className="itemField">
        <ActiveItem 
          activeProduct={this.state.activeProduct}
          products={this.props.products}/>
        </Col>
      </Row>
      </React.Fragment>
    );
  }
}

class ActiveItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: '',
      products: this.props.products
    };
  }
  componentDidMount(){
    this.state.products.map(
      (product, index) => {
        if (product.name===this.props.activeProduct){
          this.setState({
            activeItem: product
          })
        }
      }
    );
  }
  componentDidUpdate(prevProps, prevState){
    if(prevProps.activeProduct !== this.props.activeProduct){
      this.state.products.map(
        (product, index) => {
          if (product.name===this.props.activeProduct){
            this.setState({
              activeItem: product
            })
          }
        }
      );
    }
  }
  
  render() {
    return (
      <Card
        hoverable
        className="activeItem"
        cover={<img alt="example" src={this.state.activeItem.img} className="cardCover" />}
      >
        <Meta
          title={this.state.activeItem.name}
        />
        <div classsName="descriptionProduct">
          <br />
          ram : {this.state.activeItem.ram}<br />
          storage : {this.state.activeItem.storage}<br />
          display : {this.state.activeItem.display}<br />
        </div>
      </Card>
    )
  }
}

export default FilterableProductTable;