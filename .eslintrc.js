module.exports = {
    "env": {
        "browser": true,
        "commonjs": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 6
    },
    "globals": { //全局变量
    	"cc": true,
    	"module": true,
        "com": true,
        "wx": true,
        "CC_WECHATGAME": true
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
        "blocks": "always", // 普通的{}块级语句中只能设置空行
        "lines-between-class-members": ["warn","always"], // 类成员之间要有空格
        "no-multiple-empty-lines": ["error",{ "max": 1 }], // 最大空行数为1
        "space-before-function-paren": ["error", "always"], // 函数()前要带空格
        "space-before-blocks": ["error","never"], // 函数()后不带空格
        "space-infix-ops": ["error", {"int32Hint": false}], // 要求中缀操作符周围有空格
        "spaced-comment": ["error", "always"], // 要求或禁止在注释前有空白
        "padding-line-between-statements": [
            "error",
            { blankLine: "always", prev: "*", next: "return" },
            { blankLine: "always", prev: ["const", "let", "var"], next: "*"}, 
            { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"]},
            { blankLine: "always", prev: "directive", next: "*" }, 
            { blankLine: "any", prev: "directive", next: "directive" }
        ],
        "no-var": ["error"],
        "prefer-const": ["error"]
    }
};