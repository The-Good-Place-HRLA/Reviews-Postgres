import React from 'react';
import Review from './Review';

class ReviewsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }


  render() {
    
    return (
      <div>
      {this.props.currentProductReviews.map((review) => {
        return (
          <Review review={review} key={review._id}  className="jh-review-container"/>
          )
        })}
    </div>
  )
}
}
 
export default ReviewsList