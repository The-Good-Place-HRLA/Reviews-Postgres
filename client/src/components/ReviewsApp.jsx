import React from 'react';
import ReviewsList from './ReviewsList';
import axios from 'axios';
import _ from 'lodash';

class ReviewsApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentProductReviews: [],
      filteredReviews: [],
      displayedReviews: [],
      displayEndIndex: 0,
      reviewsLoaded: false,
      avgReview: 0,
      avgReviewPercent: 0,
      scoreArr: [0, 0, 0, 0, 0, 0],
      starFilters: [0, 0, 0, 0, 0, 0],
      isFiltered: false,
      numFilters: 0,
      currentSelection: 'Most Relevant'
    };

    this.getReviews = this.getReviews.bind(this);
    this.showMoreReviews = this.showMoreReviews.bind(this);
    this.filterByStars = this.filterByStars.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.clearAllFilters = this.clearAllFilters.bind(this);
    this.displayFilteredReviews = this.displayFilteredReviews.bind(this);
  }

  componentDidMount() {
    var id = window.location.href.slice(22);
    if (id === '') { id = 0 }
    this.getReviews(id);
  }

  getReviews(productID) {
    axios.get(`http://localhost:6969/api/${productID}`)
      .then(reviews => {
        var currentProductReviews = reviews.data[0].reviews;
        var filteredReviews = reviews.data[0].reviews;
        var scoreArr = [0, 0, 0, 0, 0, 0];
        var avgReview = Math.round(((_.reduce(currentProductReviews, (sum, review) => {
          scoreArr[review.stars]++;
          return sum + review.stars
        }, 0)) / currentProductReviews.length) * 10) / 10;
        var avgReviewPercent = avgReview * 20;

        if (filteredReviews.length < 8) {
          var displayEndIndex = filteredReviews.length;
        } else {
          var displayEndIndex = 8
        }

        this.setState({
          displayEndIndex,
          currentProductReviews,
          filteredReviews,
          reviewsLoaded: true,
          avgReview,
          scoreArr,
          avgReviewPercent
        }, () => { this.displayFilteredReviews() })
      })
      .catch(err => console.error(err))
  }

  displayFilteredReviews() {
    var displayedReviews = this.state.filteredReviews.slice(0, this.state.displayEndIndex);
    this.setState({ displayedReviews });
  }

  showMoreReviews() {
    var { displayEndIndex } = this.state;

    if (displayEndIndex + 30 > this.state.filteredReviews.length) {
      displayEndIndex = this.state.filteredReviews.length;
    } else {
      displayEndIndex += 30;
    }

    this.setState({ displayEndIndex }, () => this.displayFilteredReviews())
  }

  filterByStars(e) {
    var { numFilters, starFilters } = this.state;
    var starIdx = Number(e.target.getAttribute('stars'));


      if (this.state.scoreArr[starIdx]) {
        if (!starFilters[starIdx]) {
        numFilters = numFilters + 1;
        starFilters[starIdx] = 1;
        var isFiltered = true;
        var filteredReviews = this.state.currentProductReviews.filter(review => {
          console.log(review);
          console.log('starfilters: ', starFilters[review.stars])
          return starFilters[review.stars];
        });

        if (filteredReviews.length < 8) {
          var displayEndIndex = filteredReviews.length;
        } else {
          var displayEndIndex = 8;
        }
        
        this.setState({
          starFilters,
          isFiltered,
          numFilters,
          filteredReviews,
          displayEndIndex
        }, () => { this.displayFilteredReviews() });
      }
    }
  }


  clearFilter(e) {
    var { numFilters, isFiltered, starFilters } = this.state;
    var starIdx = Number(e.target.getAttribute('stars'));
    starFilters[starIdx] = 0;
    numFilters = numFilters - 1;
    var filteredReviews = this.state.filteredReviews.filter(review => review.stars != starIdx)
    
    if (numFilters === 0) {
      isFiltered = false;
      filteredReviews = this.state.currentProductReviews;
    }
    
    if (filteredReviews.length < 8) {
      var displayEndIndex = filteredReviews.length;
    } else {
      var displayEndIndex = 8
    }

    this.setState({
      starFilters,
      filteredReviews,
      numFilters,
      isFiltered,
      displayEndIndex
    }, () => { this.displayFilteredReviews() });
  }

  clearAllFilters() {
    var starFilters = [0, 0, 0, 0, 0, 0];
    var isFiltered = false;
    var numFilters = 0;
    var filteredReviews = this.state.currentProductReviews.slice();
    if (filteredReviews.length < 8) {
      var displayEndIndex = filteredReviews.length;
    } else {
      var displayEndIndex = 8
    }

    this.setState({
      starFilters,
      numFilters,
      isFiltered,
      filteredReviews,
      displayEndIndex
    }, () => { this.displayFilteredReviews() });
  }

  showWriteReview() {
    /* TODO WHOOPS */
  }

  clickSelection(e) {
    var filteredReviews = this.state.filteredReviews.slice();
    var selected = e.target.getAttribute('name');

    
    if (selected === 'mostRel') {
      filteredReviews = this.state.currentProductReviews;

    } else if (selected === 'mostHelp') {
      filteredReviews.sort((a, b) => b.yes - a.yes);
    
    } else if (selected === 'lowRating') {
      filteredReviews.sort((a, b) => a.stars - b.stars);
    
    } else if (selected === 'highRating') {
      filteredReviews.sort((a, b) => b.stars - a.stars);
    
    } else if (selected === 'mostRecent') {
      filteredReviews.sort((a, b) => {
        if (a.date > b.date) {
          return -1
        }
        if (b.date > a.date) {
          return 1
        }
        return 0
      });
    }


    
    this.setState({ 
      currentSelection: e.target.textContent, 
      filteredReviews
    }, () => this.displayFilteredReviews());
  }



  render() {

    return (
      <div className="jh-module-container">
        <div className="jh-main-container">
          <div className="jh-reviews-header-label">Reviews</div>
          <div className="jh-write-review-box">
            <a href='#jh-write-review'><button className='jh-write-review' onClick={() => this.showWriteReview()}>Write a review</button></a>
          </div>
          {this.state.reviewsLoaded ? (
            <div className="jh-summary-container">
              <div className="jh-rating-snapshot">
                <div className="jh-histogram">
                  <div className="jh-rating-snapshot-label">Rating Snapshot</div>
                  <div className="jh-rating-snapshot-body-text">Select a row below to filter reviews</div>
                  <div className="jh-graphs-container">
                    <div className="jh-graphs-box">
                      {this.state.scoreArr.map((total, index) => {
                        if (index === 0) {
                          return null
                        } else {
                          return (
                            <div className="jh-bar-graph-box" key={index} stars={index} onClick={this.filterByStars}>
                              <div className="jh-bar-graph-label" stars={index}>{index} ★ </div>
                              <div className="jh-bar-graph-container" stars={index}>
                                <div className="jh-bar-graph-empty" stars={index}></div>
                                <div className="jh-bar-graph-fill" stars={index} style={{ width: 100 * (total / this.state.currentProductReviews.length) + '%' }}></div>
                              </div>
                              <div className="jh-bar-graph-num" stars={index}>{total}</div>
                            </div>
                          )
                        }
                      })}
                    </div>
                  </div>
                </div>
                <div className="jh-avg-box">
                  <div className="jh-avg-box-label">Average Customer Ratings</div>
                  <div className="jh-avg-stars-row">
                    <div className="jh-avg-box-overall">Overall</div>
                    <div className="jh-avg-stars-box">
                      <span className="jh-avg-stars-blank">★★★★★</span>
                      <span className="jh-avg-stars-fill" style={{ width: this.state.avgReviewPercent + '%' }}>★★★★★</span>
                    </div>
                    <div className="jh-avg-stars-num">{this.state.avgReview}</div>
                  </div>
                </div>
              </div>
              <div className="jh-totals-sorting-box">
                <div className="jh-totalreviews-box">1 - {this.state.displayEndIndex} of {this.state.filteredReviews.length} Reviews</div>
                <div className="jh-sorting-box"><span className='jh-sortby'>Sort by:&nbsp;
              <button className='jh-dropdown-btn'>{this.state.currentSelection}</button>&#9662;
              <div className='jh-dropdown-selection'>
                    <div name='mostRel' onClick={(e) => this.clickSelection(e)}>Most Relevant</div>
                    <div name='mostHelp' onClick={(e) => this.clickSelection(e)}>Most Helpful</div>
                    <div name='highRating' onClick={(e) => this.clickSelection(e)}>Highest to Lowest Rating</div>
                    <div name='lowRating' onClick={(e) => this.clickSelection(e)}>Lowest to Highest Rating</div>
                    <div name='mostRecent' onClick={(e) => this.clickSelection(e)}>Most Recent</div>
                  </div>
                </span></div>
              </div>
              {this.state.isFiltered ? (
                <div className="jh-star-filter-container">
                  <div className="jh-star-filter-label">Active Filters</div>
                  <div className="jh-star-filter-boxes">
                    {this.state.starFilters.map((value, index) => {
                      if (value) {
                        return (
                          <div className="jh-star-filter-box" key={index} stars={index} onClick={this.clearFilter}>
                            <div className="jh-star-filter-box-label" stars={index}>{index} stars </div>&nbsp;
                          <div className="jh-star-filter-icon-img" stars={index}>
                              <img className="jh-star-filter-icon" stars={index} src="http://localhost:6969/icons/x-fill-white.svg" />
                            </div>
                          </div>
                        )
                      }
                    })}
                    <div className="jh-clear-all-box" onClick={this.clearAllFilters}>
                      <div className="jh-star-filter-box-label">Clear All</div>&nbsp;
                  <div className="jh-star-filter-icon-img">
                        <img className="jh-star-filter-icon" src="http://localhost:6969/icons/x-fill.svg" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                  <div></div>
                )}
              <div id='jh-write-review'><a href='jh-write-review'></a></div>
              <ReviewsList
                currentProductReviews={this.state.displayedReviews}
              />
              {this.state.filteredReviews.length === this.state.displayEndIndex ? (
                <div></div>
              ) : (
                  <div className="jh-show-more-box"><button className="jh-show-more-button" onClick={this.showMoreReviews}>Load More</button></div>
                )}
            </div>
          ) : (
              <div>Loading...</div>
            )}
        </div>
      </div>
    )
  }
}

export default ReviewsApp;