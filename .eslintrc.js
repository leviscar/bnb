module.exports = {
    "env": {
        "browser": true,
        "commonjs": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 6
    },
    "globals": {							//全局变量
    	"cc": true,
    	"module": true,
        "com": true,
        "wx": true
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": 'off',
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-unused-vars": 'off',
        "no-console": 'off',
        "blocks": "always"
    }
};