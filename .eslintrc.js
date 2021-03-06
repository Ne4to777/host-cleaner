module.exports = {
    parser: 'babel-eslint',
    root: true,
    parserOptions: {
        sourceType: 'module',
        impliedStrict: true,
    },
    plugins: [
        'jest',
    ],
    env: {
        'jest/globals': true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
        'airbnb-base/rules/strict',
        './node_modules/@yandex-market/codestyle/src/rules/style.js',
        './node_modules/@yandex-market/codestyle/src/rules/market.js',
    ],
    globals: {
        window: 'readonly',
        document: 'readonly',
        _require: 'readonly',
        _import: 'readonly',
        __non_webpack_require__: 'readonly',
    },
    rules: {
        'no-console': 'off',
        strict: 'off',
        'no-use-before-define': 'off',
        semi: 'error',
        'implicit-arrow-linebreak': 'off',
        'object-curly-newline': 'off',
        'no-confusing-arrow': 'off',
        'operator-linebreak': 'off',
        indent: 'off',
        'function-paren-newline': 'off',
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                ts: 'never',
            },
        ],
    },
    settings: {
        'import/resolver': {
            node: {
                paths: ['__tests__'],
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    overrides: [
        {
            files: ['*.ts'],
            parser: '@typescript-eslint/parser',
            extends: [
                'plugin:@typescript-eslint/recommended',
                './node_modules/@yandex-market/codestyle/src/rules/typescript.js',
            ],
            rules: {
                'no-console': 'off',
                strict: 'off',
                'no-use-before-define': 'off',
                semi: 'error',
                'implicit-arrow-linebreak': 'off',
                'object-curly-newline': 'off',
                'no-confusing-arrow': 'off',
                'operator-linebreak': 'off',
                indent: 'off',
                'function-paren-newline': 'off',
                '@typescript-eslint/indent': ['error'],
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/ban-ts-comment': 'off',
            },
        },
    ],
};
