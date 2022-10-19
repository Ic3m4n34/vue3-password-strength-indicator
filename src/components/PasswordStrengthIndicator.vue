<template>
  <div class="password">
    <div
      v-if="!strengthMeterOnly"
      class="password__group"
    >
      <input
        v-bind="$attrs"
        :ref="referenceValue"
        :type="inputType"
        :class="[defaultClass, $attrs.disabled ? disabledClass : '']"
        :value="value"
        @input="evt => emitValueFromTemplate('input', evt)"
        @blur="evt => emitValueFromTemplate('blur', evt)"
        @focus="evt => emitValueFromTemplate('focus', evt)"
      >
      <div class="password__icons">
        <div
          v-if="badge"
          v-cloak
          :class="[
            isSecure ? successClass : '',
            !isSecure && isActive ? errorClass : '' ]"
          class="password__badge"
        >
          {{ passwordCount }}
        </div>
        <div
          v-if="toggle"
          class="password__toggle"
        >
          <button
            type="button"
            class="btn-clean"
            :aria-label="showPasswordLabel"
            tabindex="-1"
            @click.prevent="togglePassword()"
          >
            <svg
              v-if="initialShowPassword"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <title>{{ showPasswordLabel }}</title>
              <path d="M12 9c1.641 0 3 1.359 3 3s-1.359 3-3 3-3-1.359-3-3 1.359-3 3-3zM12 17.016c2.766 0 5.016-2.25 5.016-5.016s-2.25-5.016-5.016-5.016-5.016 2.25-5.016 5.016 2.25 5.016 5.016 5.016zM12 4.5c5.016 0 9.281 3.094 11.016 7.5-1.734 4.406-6 7.5-11.016 7.5s-9.281-3.094-11.016-7.5c1.734-4.406 6-7.5 11.016-7.5z" />
            </svg>
            <svg
              v-else
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <title>{{ showPasswordLabel }}</title>
              <path d="M11.859 9h0.141c1.641 0 3 1.359 3 3v0.188zM7.547 9.797c-0.328 0.656-0.563 1.406-0.563 2.203 0 2.766 2.25 5.016 5.016 5.016 0.797 0 1.547-0.234 2.203-0.563l-1.547-1.547c-0.188 0.047-0.422 0.094-0.656 0.094-1.641 0-3-1.359-3-3 0-0.234 0.047-0.469 0.094-0.656zM2.016 4.266l1.266-1.266 17.719 17.719-1.266 1.266c-1.124-1.11-2.256-2.213-3.375-3.328-1.359 0.563-2.813 0.844-4.359 0.844-5.016 0-9.281-3.094-11.016-7.5 0.797-1.969 2.109-3.656 3.75-4.969-0.914-0.914-1.812-1.844-2.719-2.766zM12 6.984c-0.656 0-1.266 0.141-1.828 0.375l-2.156-2.156c1.219-0.469 2.578-0.703 3.984-0.703 5.016 0 9.234 3.094 10.969 7.5-0.75 1.875-1.922 3.469-3.422 4.734l-2.906-2.906c0.234-0.563 0.375-1.172 0.375-1.828 0-2.766-2.25-5.016-5.016-5.016z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showStrengthMeter"
      :class="[strengthMeterClass]"
    >
      <div
        :class="[strengthMeterFillClass]"
        :data-score="passwordStrength"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, ref, computed, toRefs, watch,
} from 'vue';

import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common';

type EmitType = 'show' | 'hide' | 'feedback' | 'score' | 'input' | 'blur' | 'focus';

const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
  },
};

zxcvbnOptions.setOptions(options);

export default defineComponent({
  inheritAttrs: false,
  props: {
    /**
     * Password min length.
     * Right now only visual for the badge
     * @type {Number}
     */
    secureLength: {
      type: Number as PropType<number>,
      default: 7,
    },
    /**
       * Display badge:
       * The badge shows your
       * password character count
       * up to the defined secureLength
       * @type {Boolean}
       */
    badge: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    /**
       * Show password toggle:
       * Show icon to toggle
       * the password visibility
       */
    toggle: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    /**
       * Prop to toggle the
       * cleartext password if
       * toggle is disabled
       */
    showPassword: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    /**
      * Prop to change the
      * ref of the input
      */
    referenceValue: {
      type: String as PropType<string>,
      default: 'input',
    },
    /**
       * Prop to toggle the
       * strength Meter if
       * User wants to implement
       * their own
       */
    showStrengthMeter: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    /**
       * Prop to toggle the
       * input element if
       * User wants to implement
       * their own input element
       */
    strengthMeterOnly: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    /**
       * CSS Class for the Input field
       * @type {String}
       */
    defaultClass: {
      type: String as PropType<string>,
      default: 'password__field',
    },
    /**
       * CSS Class for the disabled Input field
       * @type {String}
       */
    disabledClass: {
      type: String as PropType<string>,
      default: 'password__field--disabled',
    },
    /**
       * CSS Class for the badge
       * if a password does not match
       * the secureLength. Later for errors
       * @type {String}
       */
    errorClass: {
      type: String as PropType<string>,
      default: 'password__badge--error',
    },
    /**
       * CSS Class for the badge
       * if a password does match
       * the secureLength. Later for
       * success messages possible.
       * @type {String}
       */
    successClass: {
      type: String as PropType<string>,
      default: 'password__badge--success',
    },
    /**
       * CSS class for styling the
       * strength meter bars.
       * @type {String}
       */
    strengthMeterClass: {
      type: String as PropType<string>,
      default: 'password__strength-meter',
    },
    /**
       * strengthMeterFillClass sets the
       * individual strength width and fill
       * color of the strength meter bars.
       * @type {String}
       */
    strengthMeterFillClass: {
      type: String as PropType<string>,
      default: 'password__strength-meter--fill',
    },
    /**
       * Label for the show password icon
       */
    labelShow: {
      type: String as PropType<string>,
      default: 'Show Password',
    },
    /**
       * Label for the hide password icon
       */
    labelHide: {
      type: String as PropType<string>,
      default: 'Hide Password',
    },
    /**
       * @type String
       */
    userInputs: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  emits: ['show', 'hide', 'feedback', 'score', 'input', 'blur', 'focus'] as EmitType[],
  setup(props, { emit }) {
    const value = ref('');
    const password = ref<string | null>(null);
    const initialShowPassword = ref(false);
    const showPassword = ref(false);
    const {
      secureLength, labelHide, labelShow, strengthMeterOnly, userInputs,
    } = toRefs(props);

    const togglePassword = () => {
      if (initialShowPassword.value) {
        emit('hide');
        initialShowPassword.value = false;
      } else {
        emit('show');
        initialShowPassword.value = true;
      }
    };

    const emitValue = (type: EmitType, valueToEmit: string | null) => {
      emit(type, valueToEmit);
      password.value = valueToEmit;
    };

    const emitValueFromTemplate = (type: EmitType, e: Event) => {
      const target = e.target as HTMLInputElement;
      emitValue('input', target.value);
    };

    /**
     * passwordStrength is the score calculated by zxcvbn
     * @return {Number} Password Strength Score
     */
    const passwordStrength = computed(() => (
      password.value ? zxcvbn(password.value, (userInputs.value.length >= 1 ? userInputs.value : undefined)).score : null));

    /**
     * isSecure checks if the length of the password is longer then
     * the defined `secureLength`
     * @return {Boolean} Password length longer then minLength
     */
    const isSecure = computed(() => (
      password.value ? password.value.length >= secureLength.value : null));

    /**
     * isActive checks if a password is entered.
     * It's required for the password count badge.
     * @return {Boolean} Password entered
     */
    const isActive = computed(() => password.value && password.value.length > 0);

    /**
     * passwordCount holds the character count of the
     * current password. It shows the count up to the `secureLength`.
     * @return {Number} Password Character Count
     */
    const passwordCount = computed(() => password.value && (password.value.length > secureLength.value ? `${secureLength.value}+` : password.value.length));

    /**
     * Changing the input type from password to text
     * based on the local _showPassword data or the showPassword prop
     */
    const inputType = computed(() => (initialShowPassword.value || showPassword.value ? 'text' : 'password'));

    const showPasswordLabel = computed(() => (initialShowPassword.value || showPassword.value ? labelHide.value : labelShow.value));

    watch(value, (newValue) => {
      if (strengthMeterOnly.value) {
        emitValue('input', newValue);
      }
      console.log('feedback', zxcvbn(newValue));

      emit('feedback', zxcvbn(newValue).feedback);
    });

    watch(passwordStrength, (score: any) => {
      console.log('score', score);

      emit('score', score.score);
    });

    return {
      password,
      togglePassword,
      emitValue,
      passwordStrength,
      isSecure,
      initialShowPassword,
      isActive,
      passwordCount,
      inputType,
      showPasswordLabel,
      emitValueFromTemplate,
      value,
    };
  },
});
</script>

<style lang="scss">
  [v-cloak] {
    display: none;
  }

  .password {
    max-width:  400px;
    margin:  0 auto;
  }

  .password__group {
    position: relative;
  }

  .password__strength-meter {
    position: relative;
    height: 3px;
    background: #DDD;
    margin: 10px auto 20px;
    border-radius: 3px;
}

  .password__strength-meter:before, .password__strength-meter:after {
    content: '';
    height: inherit;
    background: transparent;
    display: block;
    border-color: #FFF;
    border-style: solid;
    border-width: 0 5px 0 5px;
    position: absolute;
    width: 20%;
    z-index: 10;
  }

  .password__strength-meter:before {
    left: 20%;
  }

  .password__strength-meter:after {
    right: 20%;
  }

  .password__strength-meter--fill {
    background: transparent;
    height: inherit;
    position: absolute;
    width: 0;
    border-radius: inherit;
    transition: width 0.5s ease-in-out, background 0.25s;
  }

  .password__strength-meter--fill[data-score='0'] {
    background: darkred;
    width: 20%;
  }

  .password__strength-meter--fill[data-score='1'] {
    background: orangered;
    width: 40%;
  }

  .password__strength-meter--fill[data-score='2'] {
    background: orange;
    width: 60%;
  }

  .password__strength-meter--fill[data-score='3'] {
    background: yellowgreen;
    width: 80%;
  }

  .password__strength-meter--fill[data-score='4'] {
    background: green;
    width: 100%;
  }

  .password__field {
    background-color: #f1f1f1;
    border: 1px solid #f1f1f1;
    border-radius: 2px;
    box-sizing: border-box;
    font-size: 14px;
    padding: 13px;
    width: 100%;
  }

  .password__field--disabled {
    background-color: #f6f6f6;
    border: 1px solid #f6f6f6;
  }

  .password__icons {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  .password__toggle {
    line-height: 1.1;
    margin-right: 13px;
  }

  .password__badge {
    position: relative;
    color: white;
    border-radius: 6px;
    padding: 3px;
    width: 30px;
    height: 15px;
    font-size: 14px;
    line-height: 1.1;
    margin-right: 13px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .password__badge--error {
    background: red;
  }

  .password__badge--success {
    background: #1bbf1b;
  }

  .btn-clean {
    appearance: none;
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
    color: #777777;
    padding: 0;

    svg {
      fill: currentColor;
    }

    &:hover, &:focus {
      color: #404B69;
    }
  }

</style>
