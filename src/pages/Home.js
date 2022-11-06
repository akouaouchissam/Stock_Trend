import React, {Component} from 'react';
import {Map, hasIn, removeIn, set} from 'immutable';
import {connect} from 'react-redux';
import TextField from '@material-ui/core/TextField';
import {withStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import {StockList} from '../components/stock';
import {getStocks} from '../actions/stock';
import {updateUserProfile} from '../actions/auth';
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/css/main.css'
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/css/util.css'
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/vendor/bootstrap/css/bootstrap.min.css'
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/fonts/font-awesome-4.7.0/css/font-awesome.min.css'
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/fonts/iconic/css/material-design-iconic-font.min.css'
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/vendor/animate/animate.css'
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/vendor/css-hamburgers/hamburgers.min.css'
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/vendor/animsition/css/animsition.min.css'
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/vendor/select2/select2.min.css'
import 'C:/Users/akoua/Desktop/stockapp/stock-app/src/pages/loginhtml/vendor/daterangepicker/daterangepicker.css'

const mapStateToProps = (state) => ({
  stocks: state.get('stock').get('stocks'),
  stock_access_freq: state.getIn(['auth', 'userProfile', 'stock_access_freq'], Map()),
  favourites: state.getIn(['auth', 'userProfile', 'favourites'], Map())
});

const mapDispatchToProps = (dispatch) => ({
  getStocks: () => dispatch(getStocks()),
  updateUserProfile: userProfile => dispatch(updateUserProfile(userProfile))
});

const styles = () => ({

});


class SearchBar extends React.Component {
  constructor(props) {
    super(props);
  }
  
  handleFilterTextChange = (e) => {
    this.props.onFilterTextChange(e.target.value);
  }
  
  handleInStockChange = (e) => {
    this.props.onInStockChange(e.target.checked);
  }
  
  render() {
    return (
      <form>
				<TextField
					id="search-stock"
          label="Search..."
          value={this.props.filterText}
          onChange={this.handleFilterTextChange}
					margin="normal"
					fullWidth
					style={{marginTop: '0px'}}
        />
      </form>
    );
  }
}


class StockTable extends React.Component {
  
  render() {
    const { 
		stocks,
		filterText, 
		oriStocksList, 
		onStockClick, 
		onAddFavouriteStock,
		isFavourite
	} = this.props;

    const filteredStocks = stocks.filter((stock) => {
        return stock.get('name').includes(filterText);
    })

    return (
        <StockList 
		  isFavourite={isFavourite}
		  stocks={filteredStocks} 
		  onStockClick={this.props.onStockClick} 
		  onAddFavouriteStock={this.props.onAddFavouriteStock}
		/>
    );
  }
}


export class FilterableStockTable extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      filterText: ''

    };
  }

  handleFilterTextChange = (filterText) => {
    this.setState({
      filterText: filterText
    });
  }



  render() {
	const {
	  stocks,
	  favourites,
	  onStockClick,
	  onAddFavouriteStock,
	  favouriteOnly,
	  recent,
	  recentOnly
	} = this.props;

	console.log('favourite, ' + favouriteOnly);

	const favouriteStocks = stocks.filter((stock) => {
	  return hasIn(favourites, [stock.get('code')]);
	});

	const nonFavouriteStocks = stocks.filter((stock) => {
		var a=favourites;
		return !(hasIn(a, [stock.get('code')]));
	});
	
	const otherStocks = nonFavouriteStocks.filter((stock) => {
	  return !(hasIn(recent, [stock.get('code')])); 
	});
	
	const recentStocks = nonFavouriteStocks.filter((stock) => {
	  return hasIn(recent, [stock.get('code')]);
	});

    return (

      <div>
        <SearchBar
          filterText={this.state.filterText}
          onFilterTextChange={this.handleFilterTextChange}
        />
    	<span class="focus-input100"></span>
		{
		  !recentOnly &&
		  favouriteStocks.count() > 0 &&
		  <React.Fragment>
		    <h3>Favourites</h3>
            <StockTable
			  isFavourite={true}
              stocks={favouriteStocks}
              filterText={this.state.filterText}
              onStockClick={onStockClick}
		      onAddFavouriteStock={onAddFavouriteStock(false)}
            />
		    <Divider />
		  </React.Fragment>
	    }	


		{
		  !favouriteOnly &&
		  recentStocks.count() > 0 &&
		  <React.Fragment>
		    <h3>Recent</h3>
		    <StockTable
			  isFavourite={false}
		      stocks={recentStocks}
		      filterText={this.state.filterText}
		      onStockClick={onStockClick}
		      onAddFavouriteStock={onAddFavouriteStock(true)}
		    />
			<Divider />
		  </React.Fragment>
		}

		{
		  !favouriteOnly &&
		  !recentOnly &&
		  otherStocks.count() > 0 &&
		  <React.Fragment>
		    <h3>Others</h3>
		    <StockTable
			  isFavourite={false}
		      stocks={otherStocks}
		      filterText={this.state.filterText}
		      onStockClick={onStockClick}
		      onAddFavouriteStock={onAddFavouriteStock(true)}
		    />
		  </React.Fragment>
		}

      </div>
    );
  }

}

class HomePage extends Component {
  onStockClick = (stockCode) => {
    this.props.history.push(`/stockDetails/${stockCode}`);
	
	// Discount old frequencies to favour newly clicked stocks
	var b = Array(this.props.stock_access_freq);
    const discounted = b.map((freq) =>
	  freq *= 0.9
	);
	var e=Map(discounted);
	this.props.updateUserProfile({
	  stock_access_freq: e.set(stockCode, e.get(stockCode, 0) + 1).toJS()
	});
  };

  onAddFavouriteStock = (isAdd) => {
	const { favourites } = this.props;
	if (isAdd) {
	  return (stockCode) => {
		var fav = set(favourites, stockCode, 1)
	    this.props.updateUserProfile({
		  favourites: fav.toJS()
		});
      }
	}
	return (stockCode) => {
		var remove = removeIn(favourites,[stockCode])
	  this.props.updateUserProfile({
		favourites: remove.toJS()
	  });
	}
  }

  componentDidMount() {
    this.props.setLoading(true);
    this.props.getStocks()
        .then(() => {
          this.props.setLoading(false);
        });
  }
  render() {
	var b = Array(this.props.stock_access_freq);
	var c = b.sort((a, b) => b - a);
    return (
      <div>
        <FilterableStockTable 
		  favouriteOnly={this.props.favouriteOnly}
		  favourites={this.props.favourites}
		  recentOnly={this.props.recentOnly}
		  recent={c}
		  stocks={this.props.stocks} 
		  onStockClick={this.onStockClick}
		  onAddFavouriteStock={this.onAddFavouriteStock}
		/>
      </div>
    );
  }
}
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(HomePage));
