/* eslint-disable prefer-template */
/* global window */
/* global document */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import noop from 'lodash';
import { getFocusableEls, isActiveElement, isTabPressed, isEscPressed } from '@sparkdesignsystem/spark-core';
import SprkSpinner from '../SprkSpinner/SprkSpinner';
import CloseButton from './CloseButton';
import ModalFooter from './ModalFooter';
import Mask from './Mask';

class SprkModal extends Component {
  static makeid() {
    const length = 3;
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    let i = 0;

    for (i = 0; i < length; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  constructor(props) {
    super(props);

    this.aria_id = SprkModal.makeid();
    this.closeButtonRef = React.createRef();
    this.footerRef = React.createRef();
    this.containerRef = React.createRef();

    this.cancel = this.cancel.bind(this);
    this.removeListeners = this.removeListeners.bind(this);
    this.attachListeners = this.attachListeners.bind(this);
    this.setInternalFocus = this.setInternalFocus.bind(this);
    this.setExternalFocus = this.setExternalFocus.bind(this);
    this.handleKeyEvents = this.handleKeyEvents.bind(this);
  }

  componentDidMount() {
    // set focus in case the modal is open by default
    this.setInternalFocus();
  }

  shouldComponentUpdate(nextProps) {
    const { isVisible } = this.props;

    // if it's closed now and going to be open
    if (!isVisible && nextProps.isVisible) {
      // save the element with focus so we can apply it later.
      this.focusTarget = document.activeElement;
    }

    return true;
  }

  componentDidUpdate(prevProps) {
    const { isVisible } = this.props;

    // if it was closed and now its open, set the internal focus
    if (isVisible && !prevProps.isVisible) {
      this.setInternalFocus();
    }

    // if it was open and now its closed, set the external focus
    if (prevProps.isVisible && !isVisible) {
      this.setExternalFocus();
    }
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  setExternalFocus() {
    const { isVisible, shouldReturnFocusOnClose } = this.props;

    // only if the modal is closed
    if (!isVisible) {
      // only if the flag says to do it
      if (shouldReturnFocusOnClose && this.focusTarget) {
        this.focusTarget.focus();
      }
    }
  }

  setInternalFocus() {
    const { isVisible, variant } = this.props;

    if (isVisible) {
      switch (variant) {
        case 'choice':
          // focus the confirm button
          this.footerRef.current.focusConfirm();
          break;
        case 'info':
          // focus the close button
          this.closeButtonRef.current.focusButton();
          break;
        case 'wait':
          // focus the whole modal
          this.containerRef.current.focus();
          break;
        default:
          // focus the whole modal
          this.containerRef.current.focus();
          break;
      }
    }
  }

  cancel() {
    const { variant, cancelClick } = this.props;

    if (variant !== 'wait') {
      cancelClick();
    }

    this.removeListeners();
  }

  handleKeyEvents(e) {
    const { isVisible, variant } = this.props;

    // Return if there is no open modal
    if (!isVisible) { return; }

    const focusableEls = getFocusableEls(this.containerRef.current);
    const firstFocusableEl = focusableEls[0];
    const lastFocusableEl = focusableEls[focusableEls.length - 1];

    switch (true) {
      case isEscPressed(e):
        if (variant !== 'wait') {
          e.preventDefault();
          this.cancel();
        }
        break;
      case isTabPressed(e) && e.shiftKey:
        if (variant === 'wait') {
          e.preventDefault();
          this.containerRef.current.focus();
        } else if (isActiveElement(firstFocusableEl)) {
          e.preventDefault();
          lastFocusableEl.focus();
        }
        break;
      case isTabPressed(e):
        if (variant === 'wait') {
          e.preventDefault();
          this.containerRef.current.focus();
        } else if (isActiveElement(lastFocusableEl)) {
          e.preventDefault();
          firstFocusableEl.focus();
        }
        break;
      default:
        break;
    }
  }

  attachListeners() {
    window.addEventListener('keydown', this.handleKeyEvents);
  }

  removeListeners() {
    window.removeEventListener('keydown', this.handleKeyEvents);
  }

  render() {
    const {
      additionalClasses,
      analyticsString,
      children,
      title,
      variant,
      confirmText,
      cancelText,
      idString,
      isVisible,
      confirmClick,
      cancelClick,
      shouldReturnFocusOnClose,
      ...rest
    } = this.props;

    if (!isVisible) { return (null); }

    const isWait = variant === 'wait';
    const isChoice = variant === 'choice';

    this.attachListeners();

    return (
      <div>
        <div
          className={
            classnames(
              'sprk-c-Modal',
              isWait ? 'sprk-c-Modal--wait' : '',
              additionalClasses,
            )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={'modalHeading_' + this.aria_id}
          aria-describedby={'modalContent_' + this.aria_id}
          data-analytics={analyticsString}
          data-id={idString}
          ref={this.containerRef}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex="0"
          {...rest}
        >
          <div className="sprk-o-Stack sprk-o-Stack--large">
            <header className="sprk-o-Stack__item sprk-c-Modal__header">
              <h2
                className="sprk-c-Modal__heading sprk-b-TypeDisplayFour"
                id={'modalHeading_' + this.aria_id}
              >
                {title}
              </h2>

              {!isWait && <CloseButton clickAction={this.cancel} ref={this.closeButtonRef} />}
            </header>

            <div>
              <div className="sprk-o-Stack__item sprk-c-Modal__body sprk-o-Stack sprk-o-Stack--medium" id={'modalContent_' + this.aria_id}>
                {isWait
                && <SprkSpinner size="large" lightness="dark" additionalClasses="sprk-o-Stack__item" />
                }
                <div className="sprk-b-TypeBodyTwo">
                  {children}
                </div>
              </div>

              {isChoice && (
                <ModalFooter
                  confirmClick={confirmClick}
                  cancelClick={this.cancel}
                  confirmText={confirmText}
                  cancelText={cancelText}
                  ref={this.footerRef}
                />
              )}
            </div>
          </div>
        </div>

        <Mask clicked={this.cancel} />
      </div>
    );
  }
}

SprkModal.propTypes = {
  // incoming children, body of the modal
  children: PropTypes.node,
  title: PropTypes.string,
  variant: PropTypes.oneOf(['wait', 'info', 'choice']),
  // text of confirm CTA in choice modal
  confirmText: PropTypes.string,
  // text of cancel CTA in choice modal
  cancelText: PropTypes.string,
  // component renders as null if false
  isVisible: PropTypes.bool,
  // event for the confirm CTA in choice modal
  confirmClick: PropTypes.func,
  // called by internal cancel function. Triggered by the cancel CTA in choice modal,
  // clicking the X, clicking the Mask, or pressing Escape
  cancelClick: PropTypes.func,
  // whether or not to automatically set focus on the last element that had focus
  shouldReturnFocusOnClose: PropTypes.bool,
  // classes to add to the class of the rendered element
  additionalClasses: PropTypes.string,
  // mapped to data-analytics
  analyticsString: PropTypes.string,
  // mapped to data-id for testing purposes
  idString: PropTypes.string,
};

SprkModal.defaultProps = {
  additionalClasses: null,
  analyticsString: null,
  children: [],
  idString: null,
  title: '',
  variant: 'choice',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  // Modals are typically hidden until invoked
  isVisible: false,
  confirmClick: noop,
  cancelClick: noop,
  shouldReturnFocusOnClose: true,
};

export default SprkModal;
