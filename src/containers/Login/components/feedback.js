import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.scss";
import "slick-carousel/slick/slick-theme.scss";

const Feedback = props => {
  const {feedback} = props;
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: false
  };

  return (
    <div className={'h-screen overflow-hidden'}>
      <Slider {...settings}>
        {feedback.map(item => {
          const image = item.image;

          return (
            <div
              key={item.id}
            >
              <div
                className={'relative feedback-wrp h-screen flex flex-col justify-end items-center'}
                style={{
                  backgroundImage: `url(${image})`
                }}
              >

                <div className={' feedback-content max-w-md mt-0 mb-0 ml-auto mr-auto text-center text-white text-xl'}>
                  <div className={'mb-8'} dangerouslySetInnerHTML={{__html: item.text}}/>
                  <div>
                    <div className={'font-bold text-lg'}>
                      {item.author}
                    </div>
                    <div className={'font-semibold text-sm opacity-50'}>
                      {item.position}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )
        })}
      </Slider>
    </div>
  )
};

export default Feedback;
