'use strict';

var React = require('react');
var Reflux = require('reflux');
var suggestStore = require('../stores/suggestStore');
var queryActions = require('../actions/queryActions');

var bs = require('react-bootstrap');

var Term = React.createClass({
  propTypes: {
    suggestedTerm: React.PropTypes.object.isRequired
  },
  acceptSuggestion: function() {
    console.log('user wants', this.props.suggestedTerm);
    // Notify the rest of the app
    queryActions.setFilter(this.props.suggestedTerm);
    queryActions.removeQueryString();

    // immediately hide the node. This is very un-react-like
    // however we are not currently storing state inside
    // suggestStore so it is difficult to update the list
    // of suggestions. Besides, suggestions are meant to be
    // ephemeral so this somewhat makes sense to me.
    React.findDOMNode(this).className += " hidden";
  },
  render: function() {
    var suggestion = this.props.suggestedTerm;
    return (
      <li className="term">
        <a onClick={this.acceptSuggestion} dangerouslySetInnerHTML={{__html:suggestion.term}} />
      </li>
    );
  }
});

var SuggestCategory = React.createClass({
  propTypes: {
    category: React.PropTypes.object.isRequired
  },
  render: function () {
    var category = this.props.category;
    var categorySuggestions = category.suggestions.map(function (suggestedTerm) {
      return (
        <Term suggestedTerm={suggestedTerm} />
      );
    });

    return (
      <li className="category">
        <h3>{category.label}</h3>
        <ul className="terms">
          {categorySuggestions}
        </ul>
      </li>
    );
  }
});

var Suggest = React.createClass({
  mixins: [
    Reflux.connect(suggestStore, 'suggestions')
  ], // this mixin binds the store (where search/filter/results state lives) to this.state.suggest
  propTypes: {
    queryString: React.PropTypes.string.isRequired
  },
  render: function() {
    var suggestions = this.state.suggestions;

    if(!suggestions) {
      return (
        <bs.Panel className="suggestions">
          <p>Finding suggestions…</p>
        </bs.Panel>
      );
    }

    var suggestLayout = suggestions.map(function(category) {
      return (
        <SuggestCategory category={category} />
      );
    });

    return (
      <bs.Panel className="suggestions">
        <ul className="categories">
          {suggestLayout}
        </ul>
      </bs.Panel>
    );
  }
});

module.exports = Suggest;
