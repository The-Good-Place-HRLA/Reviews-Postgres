import React from 'react';
import moment from 'moment';

class Review extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stars: this.props.review.stars,
      photos: this.props.review.photos,
      yes: this.props.review.yes,
      no: this.props.review.no,
      report: 'Report as inappropriate',
      helpfulClass: 'jh-helpful-button',
      colorR: '',
      colorG: '',
      reportClass: 'jh-report-button'
    }
    this.upVote = this.upVote.bind(this);
    this.reported = this.reported.bind(this);
  }

  componentDidMount() {
    this.setState({
      yes: this.props.review.yes,
      no: this.props.review.no
    })
  }

  upVote(e) {
    console.log(e.target)
    if (this.state.helpfulClass === 'jh-helpful-button') {
      this.setState({
        [e.target.getAttribute('name')]: this.state[e.target.getAttribute('name')] + 1,
        helpfulClass: 'jh-helpful-button-clicked',
        colorR: 'red',
        colorG: 'green'
      })
    }
  }

  reported() {
    this.setState({
      report: 'Reported',
      reportClass: 'jh-report-button-clicked'
    })
  }

  render() {

    return (
      <div className="jh-review-box">
        <div className="jh-name-box">
          <div className="jh-review-stars-box">
            <span className="jh-review-stars-blank">★★★★★</span>
            <span className="jh-review-stars-fill" style={{ width: (this.props.review.stars * 20) + '%' }}>★★★★★</span>
          </div>
          <span className="jh-name-label">{this.props.review.username}</span>&nbsp;
      <span>·</span>&nbsp;
      <span className="jh-time-box">{moment(this.props.review.date).fromNow()}</span></div>
        <div className="jh-title-box">{this.props.review.title}</div>
        <div className="jh-review-text-box">{this.props.review.reviewText}</div>
        <div className="jh-recommend-box">{this.props.review.recommended ? (
          <div className="jh-recommend-result"><div className="jh-star-filter-icon-img">
            <img className="jh-recommend-icon" src="http://localhost:6969/icons/check-fill.svg" />
          </div>
            <div className="jh-recommend-text-label">&nbsp; Yes, I recommend this product.</div>
          </div>
        ) : (
            <div className="jh-recommend-result"><div className="jh-star-filter-icon-img">
              <img className="jh-recommend-icon" src="http://localhost:6969/icons/x-fill.svg" />
            </div>&nbsp; No, I don't recommend this product.</div>
          )}</div>
        <div className="jh-photos-container">
          {this.props.review.photos.map((url) => {
            return (
              <div className="jh-photo-wrapper" key={url}>
                <div className="jh-photo-box">
                  <img className="jh-review-photo" src={url}>
                  </img>
                </div>
              </div>
            )
          })}

        </div>
        <div className="jh-helpful">Helpful?&nbsp;
          <button
            onClick={(e) => this.upVote(e)}
            name='yes'
            className={this.state.helpfulClass} >Yes ·&nbsp;
          <span style={{ color: this.state.colorG }}>{this.state.yes}</span>
          </button>

          <button
            onClick={(e) => this.upVote(e)}
            name='no'
            className={this.state.helpfulClass} >No ·&nbsp;
          <span style={{ color: this.state.colorR }}>{this.state.no}</span>
          </button>

          <button
            onClick={() => this.reported()}
            className={this.state.reportClass} >{this.state.report}</button>
        </div>
      </div>
    )
  }
}

export default Review