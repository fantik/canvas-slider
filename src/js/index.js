'use strict';

/**
 * App entry point.
 *
 * @module App
 */

/** Import initialized-by-default modules/libs */
import './components/Common';
import './components/PublicAPI';
import Slider from './components/Slider';

/** Import page controllers */
import Home from './pages/Home';

import { currentPage } from './modules/dev/_helpers';

/**
 * Run appropriate scripts for each page.
 **/
switch (currentPage) {
  /** Home page */
  case 'home': {
    new Slider('.canvas-wrapper');
  } break;

  /** No page found */
  default: console.warn('Undefined page');
}
