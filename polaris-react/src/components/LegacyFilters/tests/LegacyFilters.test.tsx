import React from 'react';
import {matchMedia} from '@shopify/jest-dom-mocks';
import {mountWithApp} from 'tests/utilities';

import {Button} from '../../Button';
import type {ButtonProps} from '../../Button';
import {Collapsible} from '../../Collapsible';
import {Popover} from '../../Popover';
// eslint-disable-next-line import/no-deprecated
import {Sheet} from '../../Sheet';
import {Tag} from '../../Tag';
import {TextField} from '../../TextField';
import {Text} from '../../Text';
import {WithinFilterContext} from '../../../utilities/within-filter-context';
// eslint-disable-next-line import/no-deprecated
import {LegacyFilters} from '../LegacyFilters';
import type {LegacyFiltersProps} from '../LegacyFilters';
import {ConnectedFilterControl, TagsWrapper} from '../components';
import * as focusUtils from '../../../utilities/focus';
import styles from '../LegacyFilters.module.scss';
import {Focus} from '../../Focus';

const MockFilter = (props: {id: string}) => <div id={props.id} />;
const MockChild = () => <div />;
const mockProps: LegacyFiltersProps = {
  onQueryChange: noop,
  onQueryClear: noop,
  onClearAll: noop,
  filters: [
    {
      key: 'filterOne',
      label: 'Filter One',
      filter: <MockFilter id="filterOne" />,
    },
    {
      key: 'filterTwo',
      label: 'Filter Two',
      filter: <MockFilter id="filterTwo" />,
      disabled: true,
    },
    {
      key: 'filterThree',
      label: 'Filter Three',
      filter: <MockFilter id="filterThree" />,
    },
  ],
};

describe('<LegacyFilters />', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    matchMedia.mock();
  });

  afterEach(() => {
    matchMedia.restore();
  });

  it('renders WithinFilterContext with a value of true', () => {
    WithinFilterContext;
    const filters = mountWithApp(<LegacyFilters {...mockProps} />);

    expect(filters).toContainReactComponentTimes(
      WithinFilterContext.Provider,
      1,
      {
        value: true,
      },
    );
  });

  it('calls the onQueryFocus callback when the query field is focused', () => {
    const onQueryFocus = jest.fn();
    const filters = mountWithApp(
      <LegacyFilters {...mockProps} onQueryFocus={onQueryFocus} />,
    );

    filters.find(TextField)!.trigger('onFocus');

    expect(onQueryFocus).toHaveBeenCalledTimes(1);
  });

  it('does not render the TextField when "hideQueryField" is "true"', () => {
    const filters = mountWithApp(
      <LegacyFilters {...mockProps} hideQueryField />,
    );

    expect(filters).not.toContainReactComponent(TextField);
  });

  it('renders the TextField when "hideQueryField" is false', () => {
    const filters = mountWithApp(<LegacyFilters {...mockProps} />);

    expect(filters).toContainReactComponent(TextField);
  });

  describe('toggleFilters()', () => {
    it('opens the sheet on toggle button click', () => {
      const resourceFilters = mountWithApp(<LegacyFilters {...mockProps} />);

      resourceFilters
        .find(Button, {children: 'More filters'})!
        .trigger('onClick');
      jest.runAllTimers();

      // eslint-disable-next-line import/no-deprecated
      expect(resourceFilters).toContainReactComponent(Sheet, {open: true});
    });

    it('closes the sheet on second toggle button click', () => {
      const resourceFilters = mountWithApp(<LegacyFilters {...mockProps} />);

      resourceFilters
        .find(Button, {children: 'More filters'})!
        .trigger('onClick');
      resourceFilters
        .find(Button, {children: 'More filters'})!
        .trigger('onClick');

      // eslint-disable-next-line import/no-deprecated
      expect(resourceFilters).toContainReactComponent(Sheet, {open: false});
    });

    describe('isMobile()', () => {
      it('renders a sheet on desktop size with right origin', () => {
        const resourceFilters = mountWithApp(<LegacyFilters {...mockProps} />);

        // eslint-disable-next-line import/no-deprecated
        expect(resourceFilters).toContainReactComponent(Sheet);
      });

      it('renders a sheet on mobile size with bottom origin', () => {
        matchMedia.setMedia(() => ({matches: true}));
        const resourceFilters = mountWithApp(<LegacyFilters {...mockProps} />);

        // eslint-disable-next-line import/no-deprecated
        expect(resourceFilters).toContainReactComponent(Sheet);
      });

      it('opens the sheet at mobile size on toggle button click', () => {
        matchMedia.setMedia(() => ({matches: true}));
        const resourceFilters = mountWithApp(<LegacyFilters {...mockProps} />);

        resourceFilters
          .find(Button, {children: 'More filters'})!
          .trigger('onClick');

        // eslint-disable-next-line import/no-deprecated
        expect(resourceFilters).toContainReactComponent(Sheet, {open: true});
      });

      it('closes the sheet at mobile size on second toggle button click', () => {
        matchMedia.setMedia(() => ({matches: true}));
        const resourceFilters = mountWithApp(<LegacyFilters {...mockProps} />);

        resourceFilters
          .find(Button, {children: 'More filters'})!
          .trigger('onClick');
        resourceFilters
          .find(Button, {children: 'More filters'})!
          .trigger('onClick');

        // eslint-disable-next-line import/no-deprecated
        expect(resourceFilters).toContainReactComponent(Sheet, {open: false});
      });
    });
  });

  describe('toggleFilter()', () => {
    it('opens the filter on toggle button click', () => {
      const resourceFilters = mountWithApp(<LegacyFilters {...mockProps} />);

      resourceFilters
        .find(Button, {children: 'More filters'})!
        .trigger('onClick');

      resourceFilters
        .find('button', {id: 'filterOneToggleButton'})!
        .trigger('onClick');

      expect(resourceFilters).toContainReactComponent(Collapsible, {
        id: 'filterOneCollapsible',
        open: true,
      });
    });

    it('closes the filter on second toggle button click', () => {
      const resourceFilters = mountWithApp(<LegacyFilters {...mockProps} />);

      resourceFilters
        .find(Button, {children: 'More filters'})!
        .trigger('onClick');

      const button = resourceFilters.find('button', {
        id: 'filterTwoToggleButton',
      });

      button!.trigger('onClick');
      button!.trigger('onClick');

      expect(resourceFilters).toContainReactComponent(Collapsible, {
        id: 'filterTwoCollapsible',
        open: false,
      });
    });

    it('does not close other filters when a filter is toggled', () => {
      const resourceFilters = mountWithApp(<LegacyFilters {...mockProps} />);

      resourceFilters
        .find(Button, {children: 'More filters'})!
        .trigger('onClick');

      resourceFilters
        .find('button', {id: 'filterOneToggleButton'})!
        .trigger('onClick');

      resourceFilters
        .find('button', {id: 'filterThreeToggleButton'})!
        .trigger('onClick');

      expect(resourceFilters).toContainReactComponent(Collapsible, {
        id: 'filterOneCollapsible',
        open: true,
      });

      expect(resourceFilters).toContainReactComponent(Collapsible, {
        id: 'filterThreeCollapsible',
        open: true,
      });
    });
  });

  describe('<ConnectedFilterControl />', () => {
    const mockPropsWithShortcuts: LegacyFiltersProps = {
      onQueryChange: noop,
      onQueryClear: noop,
      onClearAll: noop,
      filters: [
        {
          key: 'filterOne',
          label: 'Filter One',
          filter: <MockFilter id="filterOne" />,
          shortcut: true,
        },
        {
          key: 'filterTwo',
          label: 'Filter Two',
          filter: <MockFilter id="filterTwo" />,
        },
        {
          key: 'filterThree',
          label: 'Filter Three',
          filter: <MockFilter id="filterThree" />,
          shortcut: true,
        },
      ],
    };

    it('renders', () => {
      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockPropsWithShortcuts} />,
      );

      expect(resourceFilters).toContainReactComponent(ConnectedFilterControl);
    });

    it('renders children', () => {
      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockPropsWithShortcuts}>
          <MockChild />
        </LegacyFilters>,
      );

      expect(resourceFilters).toContainReactComponent(MockChild);
    });

    it('receives the expected props when there are shortcut filters', () => {
      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockPropsWithShortcuts} />,
      );

      expect(
        resourceFilters.find(ConnectedFilterControl)!.props
          .rightPopoverableActions,
      ).toHaveLength(2);
    });

    it('receives the expected props when the query field is hidden', () => {
      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockPropsWithShortcuts} hideQueryField />,
      );

      expect(resourceFilters).toContainReactComponent(ConnectedFilterControl, {
        queryFieldHidden: true,
      });
    });

    it('forces showing the "More Filters" button if there are filters without shortcuts', () => {
      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockPropsWithShortcuts} />,
      );

      expect(resourceFilters).toContainReactComponent(ConnectedFilterControl, {
        forceShowMorefiltersButton: true,
      });
    });

    it('does not force showing the "More Filters" button if all the filters have shorcuts', () => {
      const mockPropsWithShortcuts: LegacyFiltersProps = {
        onQueryChange: noop,
        onQueryClear: noop,
        onClearAll: noop,
        filters: [
          {
            key: 'filterOne',
            label: 'Filter One',
            filter: <MockFilter id="filterOne" />,
            shortcut: true,
          },
          {
            key: 'filterTwo',
            label: 'Filter Two',
            filter: <MockFilter id="filterTwo" />,
            shortcut: true,
          },
        ],
      };
      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockPropsWithShortcuts} />,
      );
      expect(resourceFilters).toContainReactComponent(ConnectedFilterControl, {
        forceShowMorefiltersButton: false,
      });
    });

    it('receives shortcut filters with popoverOpen set to false on mount', () => {
      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockPropsWithShortcuts} />,
      );

      const rightPopoverableActions = resourceFilters.find(
        ConnectedFilterControl,
      )!.props.rightPopoverableActions;

      rightPopoverableActions!.forEach((action) => {
        expect(action.popoverOpen).toBe(false);
      });
    });

    it('toggles a shortcut filter', () => {
      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockPropsWithShortcuts} />,
      );

      const connected = resourceFilters.find(ConnectedFilterControl);
      connected!.instance.setState({availableWidth: 999});
      resourceFilters.forceUpdate();
      const shortcut = resourceFilters
        .find('div', {className: styles.RightContainer})!
        .find(Button);

      shortcut!.trigger('onClick');
      expect(resourceFilters).toContainReactComponent(Popover, {active: true});
      shortcut!.trigger('onClick');
      expect(resourceFilters).toContainReactComponent(Popover, {active: false});
    });

    it('receives the expected props when there are no shortcut filters', () => {
      const resourceFilters = mountWithApp(<LegacyFilters {...mockProps} />);

      expect(resourceFilters).toContainReactComponent(ConnectedFilterControl, {
        rightPopoverableActions: [],
      });
    });

    it('does not render the filter button when no filters are passed in', () => {
      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockProps} filters={[]} />,
      );
      expect(resourceFilters).not.toContainReactComponent(Button, {
        children: 'More filters',
      } as ButtonProps);
    });
  });

  describe('appliedFilters', () => {
    it('calls remove callback when tag is clicked', () => {
      const spy = jest.fn();
      const appliedFilters = [{key: 'filterOne', label: 'foo', onRemove: spy}];

      const resourceFilters = mountWithApp(
        <LegacyFilters
          {...mockProps}
          queryValue="bar"
          appliedFilters={appliedFilters}
        />,
      );

      const tag = resourceFilters.find(Tag);
      const removeButton = tag!.find('button');

      removeButton!.trigger('onClick');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('filterOne');
    });

    it('calls remove callback when clear button is clicked', () => {
      const spy = jest.fn();
      const appliedFilters = [{key: 'filterOne', label: 'foo', onRemove: spy}];

      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockProps} appliedFilters={appliedFilters} />,
      );

      resourceFilters
        .find(Button, {children: 'More filters'})!
        .trigger('onClick');

      resourceFilters
        .find('button', {id: 'filterOneToggleButton'})!
        .trigger('onClick');
      const collapsible = resourceFilters.find(Collapsible, {
        id: 'filterOneCollapsible',
      });
      const buttons = collapsible!.findAll(Button);
      // last button
      const clearButton = buttons[buttons.length - 1];

      clearButton!.trigger('onClick');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('filterOne');
    });

    it('renders a clear button when clearButton is not provided', () => {
      const filters = [
        {key: 'filterOne', label: 'foo', onRemove: () => {}, filter: null},
      ];

      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockProps} filters={filters} />,
      );

      resourceFilters
        .find(Button, {children: 'More filters'})!
        .trigger('onClick');
      resourceFilters
        .find('button', {id: 'filterOneToggleButton'})!
        .trigger('onClick');

      const collapsible = resourceFilters.find(Collapsible, {
        id: 'filterOneCollapsible',
      });

      expect(collapsible).toContainReactText('Clear');
    });

    it("doesn't render a clear button when clearButton is not provided", () => {
      const filters = [
        {
          hideClearButton: true,
          key: 'filterOne',
          label: 'foo',
          onRemove: () => {},
          filter: null,
        },
      ];

      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockProps} filters={filters} />,
      );

      resourceFilters
        .find(Button, {children: 'More filters'})!
        .trigger('onClick');
      resourceFilters
        .find('button', {id: 'filterOneToggleButton'})!
        .trigger('onClick');

      const collapsible = resourceFilters.find(Collapsible, {
        id: 'filterOneCollapsible',
      });

      expect(collapsible).not.toContainReactText('Clear');
    });

    it('tags are not shown if hideTags prop is given', () => {
      const appliedFilters = [{key: 'filterOne', label: 'foo', onRemove: noop}];

      const resourceFilters = mountWithApp(
        <LegacyFilters
          {...mockProps}
          queryValue=""
          appliedFilters={appliedFilters}
          hideTags
        />,
      );
      expect(resourceFilters).not.toContainReactComponent(Tag);
    });

    it('hides the tags container when applied filters are not provided', () => {
      const resourceFilters = mountWithApp(<LegacyFilters {...mockProps} />);
      expect(resourceFilters).toContainReactComponent(TagsWrapper, {
        hidden: true,
      });
    });

    it('renders applied filters container with aria live', () => {
      const resourceFilters = mountWithApp(<LegacyFilters {...mockProps} />);
      expect(resourceFilters).toContainReactComponent('div', {
        className: 'TagsContainer',
        'aria-live': 'polite',
      });
    });

    it('applied filter count is shown if hideTags prop is given', () => {
      const appliedFilters = [
        {key: 'filterOne', label: 'foo', onRemove: noop},
        {key: 'filterTwo', label: 'bar', onRemove: noop},
      ];

      const resourceFilters = mountWithApp(
        <LegacyFilters
          {...mockProps}
          queryValue=""
          appliedFilters={appliedFilters}
          hideTags
        />,
      );

      expect(resourceFilters).toContainReactComponent(Button, {
        children: 'More filters (2)',
      });
    });

    it('calls clear all callback and shifts focus when clear all filters is clicked to prevent visual loss of focus', () => {
      const focusSpy = jest.spyOn(focusUtils, 'focusFirstFocusableNode');
      const spy = jest.fn();
      const appliedFilters = [{key: 'filterOne', label: 'foo', onRemove: spy}];

      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockProps} appliedFilters={appliedFilters} />,
      );
      resourceFilters.setProps({
        onClearAll: () => {
          resourceFilters.setProps({
            appliedFilters: [],
          });
        },
      });

      resourceFilters
        .find(Button, {children: 'More filters'})!
        .trigger('onClick');

      resourceFilters
        .find(Button, {
          children: 'Clear all filters',
          disabled: false,
        })!
        .trigger('onClick');

      expect(resourceFilters).toContainReactComponent(Button, {
        children: 'Clear all filters',
        disabled: true,
      });
      expect(focusSpy).toHaveBeenCalled();
      focusSpy.mockRestore();
    });
  });

  describe('disableQueryField', () => {
    it('does not disable the TextField by default', () => {
      const resourceFilters = mountWithApp(<LegacyFilters {...mockProps} />);

      expect(resourceFilters).toContainReactComponent(TextField, {
        disabled: false,
      });
    });

    it('does not disable the search field when false', () => {
      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockProps} disableQueryField={false} />,
      );

      expect(resourceFilters).toContainReactComponent(TextField, {
        disabled: false,
      });
    });

    it('disables the search field when true', () => {
      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockProps} disableQueryField />,
      );

      expect(resourceFilters).toContainReactComponent(TextField, {
        disabled: true,
      });
    });
  });

  describe('disabled', () => {
    it('disables the search field when true', () => {
      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockProps} queryValue="bar" disabled />,
      );

      expect(resourceFilters).toContainReactComponent(TextField, {
        disabled: true,
      });
    });

    it('disables <ConnectedFilterControl /> when true', () => {
      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockProps} disabled />,
      );

      const rightActionButton = resourceFilters.find(Button, {
        children: 'More filters',
      });

      expect(rightActionButton).toHaveReactProps({disabled: true});
    });

    it('passes disabled prop to connected filters', () => {
      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockProps} queryValue="bar" disabled />,
      );

      expect(resourceFilters).toContainReactComponent(ConnectedFilterControl, {
        disabled: true,
      });
    });

    it('subdues each filter headings <Filter /> is mounted with prop disabled as true', () => {
      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockProps} disabled />,
      );

      resourceFilters
        .find(Button, {children: 'More filters'})!
        .trigger('onClick');

      mockProps.filters.forEach((filter) => {
        const toggleButton = resourceFilters.find('button', {
          id: `${filter.key}ToggleButton`,
        });

        expect(toggleButton!).toContainReactComponent(Text, {
          tone: 'subdued',
        });
      });
    });

    it('is passed to <Tag /> with set value', () => {
      const appliedFilters = [{key: 'filterOne', label: 'foo', onRemove: noop}];

      const resourceFilters = mountWithApp(
        <LegacyFilters
          {...mockProps}
          appliedFilters={appliedFilters}
          disabled
        />,
      );

      resourceFilters.findAll(Tag).forEach((tag) => {
        expect(tag).toHaveReactProps({disabled: true});
      });
    });

    describe('individual filters', () => {
      it('subdues disabled filters heading', () => {
        const resourceFilters = mountWithApp(<LegacyFilters {...mockProps} />);

        resourceFilters
          .find(Button, {children: 'More filters'})!
          .trigger('onClick');

        mockProps.filters
          .filter(({disabled}) => disabled)
          .forEach((filter) => {
            const toggleButton = resourceFilters.find('button', {
              id: `${filter.key}ToggleButton`,
            });

            expect(toggleButton).toContainReactComponent(Text, {
              tone: 'subdued',
            });
          });
      });

      it('does not subdue active filters heading', () => {
        const resourceFilters = mountWithApp(<LegacyFilters {...mockProps} />);

        resourceFilters
          .find(Button, {children: 'More filters'})!
          .trigger('onClick');

        mockProps.filters
          .filter(({disabled}) => !disabled)
          .forEach((filter) => {
            const toggleButton = resourceFilters.find('button', {
              id: `${filter.key}ToggleButton`,
            });

            expect(toggleButton).toContainReactComponent(Text, {
              tone: undefined,
            });
          });
      });
    });
  });

  describe('helpText', () => {
    it('renders a subdued <Text /> when provided', () => {
      const helpText = 'Important filters information';
      const resourceFilters = mountWithApp(
        <LegacyFilters {...mockProps} helpText={helpText} />,
      );

      const helpTextMarkup = resourceFilters.findAll('div', {
        id: 'FiltersHelpText',
      });
      expect(helpTextMarkup).toHaveLength(1);
      expect(helpTextMarkup[0]).toContainReactComponent(Text, {
        children: helpText,
      });
    });

    it('is not rendered when not provided', () => {
      const resourceFilters = mountWithApp(<LegacyFilters {...mockProps} />);

      expect(resourceFilters).not.toContainReactComponent('div', {
        id: 'FiltersHelpText',
      });
    });
  });

  describe('readyForFocus', () => {
    it('unfocuses the filter when a filter is toggled', () => {
      const resourceFilters = mountWithApp(<LegacyFilters {...mockProps} />);

      resourceFilters
        .find(Button, {children: 'More filters'})!
        .trigger('onClick');

      resourceFilters
        .find('button', {id: 'filterOneToggleButton'})!
        .trigger('onClick');

      expect(
        resourceFilters.find(Collapsible, {id: 'filterOneCollapsible'})!,
      ).toContainReactComponent(Focus, {
        disabled: true,
      });
    });

    it('focuses the filter when Collapsible is opened', () => {
      const resourceFilters = mountWithApp(<LegacyFilters {...mockProps} />);

      resourceFilters
        .find(Button, {children: 'More filters'})!
        .trigger('onClick');

      resourceFilters
        .find('button', {id: 'filterOneToggleButton'})!
        .trigger('onClick');

      expect(
        resourceFilters.find(Collapsible, {id: 'filterOneCollapsible'})!,
      ).toContainReactComponent(Focus, {
        disabled: true,
      });

      resourceFilters.find(Collapsible)!.trigger('onAnimationEnd');

      expect(
        resourceFilters.find(Collapsible, {id: 'filterOneCollapsible'})!,
      ).toContainReactComponent(Focus, {
        disabled: false,
      });
    });
  });
});

function noop() {}
