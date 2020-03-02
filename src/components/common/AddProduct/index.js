import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AutosizeInput from 'react-input-autosize';
import _ from 'lodash';
import { Popover, Tooltip } from 'antd';

import Icon from '../Icon';
import MarketplaceSelect from '../MarketplaceSelect';

import ProductService from '../../../services/ProductsService';

import {
  getProducts,
  getTotalProductsCount,
  getAsinsProgress,
} from '../../../redux/products/actions';
import { getMarketplaces, isMobile } from '../../../redux/app/actions';

import '../../../scss/components/AddProduct.scss';
import FileDropzone from './FileDropzone';
import LoadingAnimation from '../LoadingAnimation';
import { Link } from 'react-router-dom';

const Asin = ({ type, asin, grow, marketplace, onRemoveAsin }) => {
  let flag = '';

  if (marketplace) {
    flag = (
      <div className="reviews__flag mr-4">
        <img
          src={`/images/Flags/${marketplace.code}.svg`}
          alt={`${marketplace.code} Amazon Marketplace`}
        />
      </div>
    );
  }

  return (
    <div
      className={
        'flex items-center rounded h-7 bg-water-blue px-3.5 mx-1 mb-2 text-white position-rlt text-xs font-semibold ' +
        (grow ? 'flex-grow justify-center' : '')
      }
    >
      {flag}
      {asin}
      <button
        className="cursor-pointer absolute pin-t pin-r flex justify-center items-center w-3.5 h-3.5 -mt-1 -mr-1 rounded-full bg-white text-water-blue hover:bg-coral-pink-hover hover:text-white leading-none shadow-vp-shallow"
        onClick={() => onRemoveAsin(asin)}
      >
        <Icon name="cross" class="text-3xs -ml-px" />
      </button>
    </div>
  );
};

export class AddProduct extends Component {
  static propTypes = {
    totalCount: PropTypes.number,
    showCount: PropTypes.bool,
    placement: PropTypes.string,
    largeButton: PropTypes.bool,
    className: PropTypes.string,
  };

  static defaultProps = {
    showCount: false,
    placement: 'bottomLeft',
    largeButton: false,
    className: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      //  Controls
      loading: false,
      popoverVisible: false,
      fileSelected: false,
      processing: false,
      error: null,
      allowed_add_product: true,
      marketplaceTooltipVisible: false,
      uploadedProgress: 0,
      //  Values
      asins: [],
      inputValue: '',
      marketplace: 'US',
    };
    this.asinInputRef = React.createRef();
  }

  /**
   * Actions
   */

  getProducts() {
    const { getProducts } = this.props;
    getProducts();
  }

  getTotalProductsCount() {
    const { getTotalProductsCount } = this.props;
    getTotalProductsCount();
  }

  getAsinsProgress() {
    const { getAsinsProgress } = this.props;
    getAsinsProgress();
  }

  /**
   * Controls
   */

  clear = () => {
    this.setState({
      loading: false,
      popoverVisible: false,
      fileSelected: false,
      processing: false,
      error: null,
      marketplaceTooltipVisible: false,
      uploadedProgress: 0,
      //  Values
      asins: [],
      inputValue: '',
      marketplace_id: undefined,
    });
  };

  onVisibleChange = popoverVisible => {
    if (popoverVisible) {
      if (this.props.user && this.props.user.current_user.settings.show_tour)
        this.props.closeTour();
      this.setState({ error: null, allowed_add_product: true });
    }
    this.setState({ popoverVisible });
  };

  inputChange = event => {
    this.setState({ inputValue: event.target.value });
  };

  inputKeyPress = event => {
    //  Validate and add products on enter press
    this.setState({ error: null });
    if (event.key === 'Enter' || event.key === ',' || event.key === ' ') {
      this.validateProduct();
    }
  };

  inputFocusOut = event => {
    if (event.target.value) {
      this.inputChange(event);
      setTimeout(() => {
        this.validateProduct();
      }, 50);
    }
  };

  inputKeyDown = event => {
    const { inputValue, asins } = this.state;
    //  Remove last product in list on backspace press
    //  when input is empty
    if (event.key === 'Backspace' && inputValue.length === 0) {
      this.setState({
        asins: _.dropRight(asins),
      });
    }
  };

  onMarketplaceTooltipVisibleChange = marketplaceTooltipVisible => {
    this.setState({ marketplaceTooltipVisible });
  };

  onMarketplaceSelect = (value, options) => {
    this.setState({ marketplace: value });
  };

  onFileSelect = files => {
    const supportedFormats = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    this.setState({ error: null });

    if (files.length > 1) {
      this.setState({
        error: 'Upload of multiple files is not supported',
      });
      return;
    }

    if (!supportedFormats.includes(files[0].type)) {
      this.setState({
        error: 'File type is not supported. Try CSV or XLS/XLSX',
      });
      return;
    }

    this.setState({
      fileSelected: true,
      file: files[0],
    });

    this.uploadFile();
  };

  /**
   * API
   */

  validateProduct = () => {
    const { inputValue, asins } = this.state;

    if (_.some(asins, ['asin', inputValue])) {
      this.setState({
        error: 'You have already entered this ASIN',
      });
      return;
    }

    this.setState({
      loading: true,
      error: null,
    });

    return ProductService.validate(inputValue)
      .then(response => {
        if (response.valid && _.some(asins, ['asin', response.asin])) {
          this.setState({
            error: 'You have already entered this ASIN',
          });
        } else if (response.valid) {
          this.setState({
            asins: _.unionBy(asins, [response], 'asin'),
            error: null,
          });
        } else {
          if (response.allowed_add_product === false) {
            this.setState({
              error: response.error,
              allowed_add_product: false,
            });
          } else {
            this.setState({
              error: 'URL or ASIN you entered is invalid',
            });
          }
        }
      })
      .finally(() => {
        this.setState({ inputValue: '', loading: false });
      });
  };

  uploadFile = () => {
    const { file, marketplace, asins } = this.state;

    if (!file) {
      return;
    }

    if (!marketplace) {
      this.setState({
        error: 'Please select a marketplace and try again',
        fileSelected: false,
        file: null,
      });

      return;
    }

    this.setState({ processing: true });

    return ProductService.upload(file, marketplace, this.onUploadProgress)
      .then(res => {
        if (res.error) {
          this.setState({
            processing: false,
            error: res.error,
          });
          return;
        }

        this.setState({
          processing: false,
          asins: _.unionBy(asins, [...res.products], 'asin'),
        });
      })
      .catch(error => {
        this.setState({
          processing: false,
          error: error.response.data.error,
        });
      });
  };

  /**
   * Update upload progress
   *
   * @param {object} progressEvent
   */
  onUploadProgress = progressEvent => {
    const { total, loaded } = progressEvent;

    this.setState({
      uploadedProgress: Math.round((loaded / total) * 100),
    });
  };

  /**
   * Submit products
   *
   * @param {object} event - click event
   */
  submit = event => {
    const { pathname } = this.props;
    const { asins } = this.state;

    this.setState({ loading: true });

    const products = this.processASINs(asins);

    if (products.error) {
      this.setState({
        loading: false,
        error: products.error,
      });
      return;
    }

    return ProductService.add(products)
      .then(res => {
        this.clear();

        //  Refresh products list if added product on the Products page
        if (pathname.indexOf('/products') !== -1) {
          // debugger;

          this.getProducts();
          this.getTotalProductsCount();
          this.getAsinsProgress();
        }
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error.response.data.error,
        });
      });
  };

  processASINs = asins => {
    const { marketplace } = this.state;

    if (
      _.some(asins, asin => {
        return typeof asin.marketplace === 'undefined';
      }) &&
      !marketplace
    ) {
      return {
        error: 'Please specify a marketplace',
      };
    }

    return _.map(asins, asin => {
      if (typeof asin.marketplace === 'object') {
        asin.marketplace = asin.marketplace.code;
      } else if (typeof asin.marketplace === 'undefined' && marketplace) {
        asin.marketplace = marketplace;
      } else if (typeof asin.marketplace === 'undefined' && !marketplace) {
        return {
          error: 'Unknown marketplace',
        };
      }

      return {
        asin: asin.asin,
        marketplace: asin.marketplace,
      };
    });
  };

  /**
   * Clear file input
   */
  clearFile = () => {
    this.setState({
      fileSelected: false,
      file: null,
      asins: [],
    });
  };

  componentDidMount() {
    const { getTotalProductsCount, getMarketplaces } = this.props;

    getTotalProductsCount();
    getMarketplaces();
  }

  handleRemoveAsin = asin => {
    let { asins } = this.state;
    asins = asins.filter(a => a.asin !== asin);
    this.setState({ asins });
  };

  render() {
    const {
      showCount,
      totalCount,
      placement,
      largeButton,
      mobile,
      className,
    } = this.props;
    const {
      asins,
      error,
      inputValue,
      popoverVisible,
      file,
      fileSelected,
      processing,
      marketplace,
      marketplaceTooltipVisible,
      uploadedProgress,
      loading,
      allowed_add_product,
    } = this.state;
    const inputActive = asins.length > 0 || inputValue;

    if (this.asinInputRef.current && this.asinInputRef.current.input) {
      setTimeout(() => {
        let pattern = /(?:^|\s)ant-select-selection(?:\s|$)/;
        if (!document.activeElement.className.match(pattern)) {
          this.asinInputRef.current.input.focus();
        }
      }, 100);
    }

    const classes = {
      button:
        `flex justify-center items-center text-white leading-none rounded-full ml-2.5 ${className} ` +
        (largeButton ? ' w-11 h-11' : ' h-9 w-9') +
        (popoverVisible
          ? ` bg-dusk hover:bg-dusk-80 shadow-vp-default ${
              largeButton ? 'text-base' : 'text-sm'
            }`
          : ` bg-water-blue shadow-reviews-water-blue hover:water-blue-hover ${
              largeButton ? 'text-lg' : 'text-base'
            }`),
      inputBox:
        'reviews__add-products-input-box flex flex-wrap w-full p-3.5 min-h-50px rounded-lg border mb-4',
      submit:
        'ml-5 h-11 w-24 text-white rounded bg-water-blue shadow-vp-blue hover:water-blue-hover hover:shadow-vp-blue-hover text-xs font-bold uppercase ',
    };

    const asinBlocks =
      asins &&
      asins.map(asin => {
        return (
          <Asin
            {...asin}
            key={asin.asin}
            onRemoveAsin={this.handleRemoveAsin}
          />
        );
      });

    const content = (
      <section style={{ width: mobile ? '100%' : 360 }}>
        {loading && (
          <div className="absolute pin-t pin-l w-full h-full bg-white-50 z-30">
            <LoadingAnimation />
          </div>
        )}
        {/* ASINS input */}
        {!fileSelected && (
          <div className={classes.inputBox}>
            {asinBlocks}

            <AutosizeInput
              value={inputValue}
              onChange={this.inputChange}
              onKeyPress={this.inputKeyPress}
              onKeyDown={this.inputKeyDown}
              onBlur={this.inputFocusOut}
              placeholder="Enter ASINs or URL of your products…"
              className="text-sm flex-grow"
              autoFocus={true}
              ref={this.asinInputRef}
            />
          </div>
        )}

        {/* File name */}
        {fileSelected && (
          <div
            className={
              classes.inputBox.replace('border', '') +
              ' justify-between items-center ' +
              (error ? 'bg-coral-pink-10' : 'bg-water-blue-10')
            }
          >
            <div>
              <Icon name="file" />
              <span>{file.path}</span>
            </div>

            <button
              onClick={this.clearFile}
              className="flex justify-center items-center w-4 h-4 rounded-full bg-black opacity-15 hover:opacity-80 leading-none"
            >
              <Icon name="cross" className="text-3xs text-white" />
            </button>
          </div>
        )}

        {/* Select marketplace */}
        <div
          className={classes.inputBox
            .replace('p-3.5', '')
            .replace('flex-wrap', '')}
        >
          <MarketplaceSelect
            value={marketplace}
            placeholderText="Select Marketplace to add ASINs"
            placeholderClass="w-full h-full flex justify-between items-center leading-none font-medium text-sm px-3.5 text-dusk-30"
            onChange={this.onMarketplaceSelect}
            noBorder={true}
            shrink={true}
          />

          <Tooltip
            placement="topRight"
            title="Amazon Marketplace to use for products added by ASIN. Products added by URL will use the marketplace detected in the URL."
            trigger="click"
            arrowPointAtCenter
            visible={marketplaceTooltipVisible}
            onVisibleChange={this.onMarketplaceTooltipVisibleChange}
            overlayStyle={{ width: 382, maxWidth: 382 }}
          >
            <div
              className={
                'flex-no-shrink cursor-pointer flex items-center justify-center w-50px h-50px border-l text-arrow text-sm lg:text-base '
              }
              style={{
                backgroundColor: marketplaceTooltipVisible ? '#f3f4f5' : false,
              }}
            >
              <Icon
                name={marketplaceTooltipVisible ? 'info-hover' : 'information'}
              />
            </div>
          </Tooltip>
        </div>

        {/* File input */}
        {!inputActive && !fileSelected && (
          <FileDropzone
            wrapperStyle={{ height: 160 }}
            onDrop={this.onFileSelect}
            theme="solid"
          >
            <div className="text-sm text-light-grey-blue font-medium text-center">
              <strong>Need to add a bunch?</strong>
              <br />
              Upload CSV or XLS
            </div>
          </FileDropzone>
        )}

        {/* Processing box */}
        {processing && (
          <div className={classes.inputBox} style={{ height: 50 }}>
            <div className="border-r w-50px h-50px">
              <LoadingAnimation size={30} />
            </div>
            <div className="flex-grow text-center">{uploadedProgress}%</div>
          </div>
        )}

        {/* Products count and "Add" button */}
        {asins.length > 0 && (
          <div className="flex items-center">
            <div
              className={classes.inputBox
                .replace('mb-4', '')
                .replace('p-3.5', '')
                .replace('min-h-50px', 'min-h-11')}
            >
              <div className="flex justify-center items-center border-r w-11 h-11">
                <div className="flex justify-center items-center w-4 h-4 rounded-full bg-leafy-green leading-none">
                  <Icon name="check" class="text-1/2 text-white ml-px" />
                </div>
              </div>
              <div className="flex justify-center flex-col flex-grow text-center text-xs text-semibold leading-tight">
                <div className="text-xxs font-semibold text-dusk">
                  <span className="text-light-grey-blue">Analyzed ASINs: </span>{' '}
                  {asins.length}
                </div>
                <div className="text-xs font-semibold text-dusk">
                  {asins.length} {asins.length === 1 ? 'Product' : 'Products'}{' '}
                  Detected
                </div>
              </div>
            </div>
            <button className={classes.submit} onClick={this.submit}>
              Add · {asins.length}
            </button>
          </div>
        )}

        {/* Error Box */}
        {error && (
          <div
            className={
              classes.inputBox
                .replace('mb-4', 'mt-4')
                .replace('p-3.5', '')
                .replace('min-h-50px', 'min-h-11')
                .replace('flex-wrap', '') +
              ' text-coral-pink justify-center items-center'
            }
          >
            <div className="flex justify-center items-center border-r w-11 h-11">
              <div className="flex justify-center items-center w-4 h-4 rounded-full bg-coral-pink leading-none">
                <Icon name="cross" class="text-3xs text-white ml-px" />
              </div>
            </div>
            <div className="flex-grow text-center text-xs text-semibold">
              {error}{' '}
              {allowed_add_product === false ? (
                <>
                  <Link
                    to="/settings?tab=Subscription"
                    onClick={() => this.onVisibleChange(false)}
                  >
                    Click here
                  </Link>{' '}
                  to upgrade your plan.
                </>
              ) : (
                ''
              )}
            </div>
          </div>
        )}
      </section>
    );

    const popoverProps = {
      trigger: 'click',
      arrowPointAtCenter: !mobile,
      placement,
      onVisibleChange: this.onVisibleChange,
      visible: popoverVisible,
      overlayClassName: 'reviews__add-product',
      content,
      align: mobile
        ? {
            offset: [1, 0],
          }
        : {},
    };

    return (
      <>
        {showCount && (
          <div className="border rounded after-arrow-right bg-white h-7 text-light-grey-blue font-bold text-xs">
            <div className="content flex items-center px-3">{totalCount}</div>
          </div>
        )}

        <Popover {...popoverProps}>
          <button className={classes.button}>
            <Icon name={popoverVisible ? 'cross' : 'add'} />
          </button>
        </Popover>
      </>
    );
  }
}

const mapStateToProps = state => ({
  totalCount: state.Products.totalCount,
  totalCountLoading: state.Products.totalCountLoading,
  marketplacesLoading: state.App.marketplacesLoading,
  marketplaces: state.App.marketplaces,
  defaultMarketplace: state.App.defaultMarketplace,
  pathname: state.router.location.pathname,
  mobile: isMobile(state.App.view),
  user: state.Auth.currentUser,
});

const mapDispatchToProps = {
  getProducts,
  getTotalProductsCount,
  getMarketplaces,
  getAsinsProgress,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddProduct);
