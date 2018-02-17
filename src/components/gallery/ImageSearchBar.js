import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fuzzySearch } from '../../utils/redux/actions'

class ImageSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    }
  }

  handleChange (e) {
    this.setState({
      search: e.target.value
    })
    this.props.fuzzySearch(this.state.search)
  }

  render() {
    return (
      <div>
        <input onChange={this.handleChange} id='image-searchbar' type='text' placeholder='Search Images' value={this.state.search} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    onFuzzySearch: term => dispatch(fuzzySearch(term))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageSearchBar)