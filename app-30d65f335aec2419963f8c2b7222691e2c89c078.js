(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.bq.ac === region.bI.ac)
	{
		return 'on line ' + region.bq.ac;
	}
	return 'on lines ' + region.bq.ac + ' through ' + region.bI.ac;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.cq,
		impl.cM,
		impl.cJ,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		E: func(record.E),
		br: record.br,
		be: record.be
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.E;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.br;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.be) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.cq,
		impl.cM,
		impl.cJ,
		function(sendToApp, initialModel) {
			var view = impl.cN;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.cq,
		impl.cM,
		impl.cJ,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.bo && impl.bo(sendToApp)
			var view = impl.cN;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.cb);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.cL) && (_VirtualDom_doc.title = title = doc.cL);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.cv;
	var onUrlRequest = impl.cw;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		bo: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.cB === next.cB
							&& curr.cn === next.cn
							&& curr.cz.a === next.cz.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		cq: function(flags)
		{
			return A3(impl.cq, flags, _Browser_getUrl(), key);
		},
		cN: impl.cN,
		cM: impl.cM,
		cJ: impl.cJ
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { cm: 'hidden', cd: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { cm: 'mozHidden', cd: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { cm: 'msHidden', cd: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { cm: 'webkitHidden', cd: 'webkitvisibilitychange' }
		: { cm: 'hidden', cd: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		b$: _Browser_getScene(),
		b4: {
			b6: _Browser_window.pageXOffset,
			b7: _Browser_window.pageYOffset,
			b5: _Browser_doc.documentElement.clientWidth,
			bN: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		b5: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		bN: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			b$: {
				b5: node.scrollWidth,
				bN: node.scrollHeight
			},
			b4: {
				b6: node.scrollLeft,
				b7: node.scrollTop,
				b5: node.clientWidth,
				bN: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			b$: _Browser_getScene(),
			b4: {
				b6: x,
				b7: y,
				b5: _Browser_doc.documentElement.clientWidth,
				bN: _Browser_doc.documentElement.clientHeight
			},
			cf: {
				b6: x + rect.left,
				b7: y + rect.top,
				b5: rect.width,
				bN: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.cg.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.cg.b, xhr)); });
		$elm$core$Maybe$isJust(request.B) && _Http_track(router, xhr, request.B.a);

		try {
			xhr.open(request.cs, request.O, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.O));
		}

		_Http_configureRequest(xhr, request);

		request.cb.a && xhr.setRequestHeader('Content-Type', request.cb.a);
		xhr.send(request.cb.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.cl; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.cK.a || 0;
	xhr.responseType = request.cg.d;
	xhr.withCredentials = request.b9;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		O: xhr.responseURL,
		cG: xhr.status,
		cH: xhr.statusText,
		cl: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			cF: event.loaded,
			b1: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			cC: event.loaded,
			b1: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}

function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}

// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.ct) { flags += 'm'; }
	if (options.cc) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.e) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.g),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.g);
		} else {
			var treeLen = builder.e * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.h) : builder.h;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.e);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.g) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.g);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{h: nodeList, e: (len / $elm$core$Array$branchFactor) | 0, g: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {ck: fragment, cn: host, bT: path, cz: port_, cB: protocol, i: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$NethysSearch$Dark = 0;
var $author$project$NethysSearch$Standard = 0;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $author$project$NethysSearch$defaultFlags = {ap: '/', H: '', A: true};
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $webbhuset$elm_json_decode$Json$Decode$Field$attempt = F3(
	function (fieldName, valueDecoder, continuation) {
		return A2(
			$elm$json$Json$Decode$andThen,
			continuation,
			$elm$json$Json$Decode$maybe(
				A2($elm$json$Json$Decode$field, fieldName, valueDecoder)));
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $webbhuset$elm_json_decode$Json$Decode$Field$require = F3(
	function (fieldName, valueDecoder, continuation) {
		return A2(
			$elm$json$Json$Decode$andThen,
			continuation,
			A2($elm$json$Json$Decode$field, fieldName, valueDecoder));
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$NethysSearch$flagsDecoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'currentUrl',
	$elm$json$Json$Decode$string,
	function (currentUrl) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'elasticUrl',
			$elm$json$Json$Decode$string,
			function (elasticUrl) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
					'showHeader',
					$elm$json$Json$Decode$bool,
					function (showHeader) {
						return $elm$json$Json$Decode$succeed(
							{
								ap: currentUrl,
								H: elasticUrl,
								A: A2($elm$core$Maybe$withDefault, $author$project$NethysSearch$defaultFlags.A, showHeader)
							});
					});
			});
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$NethysSearch$document_getNodeHeight = _Platform_outgoingPort('document_getNodeHeight', $elm$json$Json$Encode$string);
var $author$project$NethysSearch$queryOptionsDummyId = 'query-options-dummy';
var $author$project$NethysSearch$getQueryOptionsHeight = $author$project$NethysSearch$document_getNodeHeight($author$project$NethysSearch$queryOptionsDummyId);
var $author$project$NethysSearch$localStorage_get = _Platform_outgoingPort('localStorage_get', $elm$json$Json$Encode$string);
var $author$project$NethysSearch$parseUrl = function (url) {
	return A2(
		$elm$core$Maybe$withDefault,
		{ck: $elm$core$Maybe$Nothing, cn: '', bT: '', cz: $elm$core$Maybe$Nothing, cB: 0, i: $elm$core$Maybe$Nothing},
		$elm$url$Url$fromString(url));
};
var $author$project$NethysSearch$GotSearchResult = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $author$project$NethysSearch$searchFields = _List_fromArray(
	['name', 'text^0.1', 'trait_raw', 'type']);
var $author$project$NethysSearch$buildElasticsearchQueryStringQueryBody = function (queryString) {
	return _List_fromArray(
		[
			_List_fromArray(
			[
				_Utils_Tuple2(
				'query_string',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'query',
							$elm$json$Json$Encode$string(queryString)),
							_Utils_Tuple2(
							'default_operator',
							$elm$json$Json$Encode$string('AND')),
							_Utils_Tuple2(
							'fields',
							A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, $author$project$NethysSearch$searchFields))
						])))
			])
		]);
};
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === -2) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Set$isEmpty = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$isEmpty(dict);
};
var $elm$core$Basics$not = _Basics_not;
var $elm_community$maybe_extra$Maybe$Extra$cons = F2(
	function (item, list) {
		if (!item.$) {
			var v = item.a;
			return A2($elm$core$List$cons, v, list);
		} else {
			return list;
		}
	});
var $elm_community$maybe_extra$Maybe$Extra$values = A2($elm$core$List$foldr, $elm_community$maybe_extra$Maybe$Extra$cons, _List_Nil);
var $author$project$NethysSearch$buildSearchFilterTerms = function (model) {
	return $elm_community$maybe_extra$Maybe$Extra$values(
		_List_fromArray(
			[
				($elm$core$Set$isEmpty(model.b) || (!model.l)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
				_Utils_Tuple2(
					'terms',
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'trait',
								A2(
									$elm$json$Json$Encode$list,
									$elm$json$Json$Encode$string,
									$elm$core$Set$toList(model.b)))
							])))),
				($elm$core$Set$isEmpty(model.c) || (!model.m)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
				_Utils_Tuple2(
					'terms',
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'type',
								A2(
									$elm$json$Json$Encode$list,
									$elm$json$Json$Encode$string,
									$elm$core$Set$toList(model.c)))
							]))))
			]));
};
var $author$project$NethysSearch$buildSearchMustNotTerms = function (model) {
	return $elm_community$maybe_extra$Maybe$Extra$values(
		_List_fromArray(
			[
				($elm$core$Set$isEmpty(model.b) || model.l) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
				_Utils_Tuple2(
					'terms',
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'trait',
								A2(
									$elm$json$Json$Encode$list,
									$elm$json$Json$Encode$string,
									$elm$core$Set$toList(model.b)))
							])))),
				($elm$core$Set$isEmpty(model.c) || model.m) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
				_Utils_Tuple2(
					'terms',
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'type',
								A2(
									$elm$json$Json$Encode$list,
									$elm$json$Json$Encode$string,
									$elm$core$Set$toList(model.c)))
							]))))
			]));
};
var $elm$core$String$words = _String_words;
var $author$project$NethysSearch$buildStandardQueryBody = function (queryString) {
	return _List_fromArray(
		[
			_List_fromArray(
			[
				_Utils_Tuple2(
				'match_phrase_prefix',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'name',
							$elm$json$Json$Encode$object(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'query',
										$elm$json$Json$Encode$string(queryString))
									])))
						])))
			]),
			_List_fromArray(
			[
				_Utils_Tuple2(
				'bool',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'must',
							A2(
								$elm$json$Json$Encode$list,
								$elm$json$Json$Encode$object,
								A2(
									$elm$core$List$map,
									function (word) {
										return _List_fromArray(
											[
												_Utils_Tuple2(
												'multi_match',
												$elm$json$Json$Encode$object(
													_List_fromArray(
														[
															_Utils_Tuple2(
															'query',
															$elm$json$Json$Encode$string(word)),
															_Utils_Tuple2(
															'type',
															$elm$json$Json$Encode$string('best_fields')),
															_Utils_Tuple2(
															'fields',
															A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, $author$project$NethysSearch$searchFields)),
															_Utils_Tuple2(
															'fuzziness',
															$elm$json$Json$Encode$string('auto'))
														])))
											]);
									},
									$elm$core$String$words(queryString))))
						])))
			])
		]);
};
var $author$project$NethysSearch$encodeObjectMaybe = function (list) {
	return $elm$json$Json$Encode$object(
		$elm_community$maybe_extra$Maybe$Extra$values(list));
};
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm_community$list_extra$List$Extra$last = function (items) {
	last:
	while (true) {
		if (!items.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!items.b.b) {
				var x = items.a;
				return $elm$core$Maybe$Just(x);
			} else {
				var rest = items.b;
				var $temp$items = rest;
				items = $temp$items;
				continue last;
			}
		}
	}
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $author$project$NethysSearch$sortDirToString = function (dir) {
	if (!dir) {
		return 'asc';
	} else {
		return 'desc';
	}
};
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$NethysSearch$buildSearchBody = function (model) {
	return $author$project$NethysSearch$encodeObjectMaybe(
		_List_fromArray(
			[
				$elm$core$Maybe$Just(
				_Utils_Tuple2(
					'query',
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'bool',
								$author$project$NethysSearch$encodeObjectMaybe(
									_List_fromArray(
										[
											$elm$core$String$isEmpty(model.i) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
											_Utils_Tuple2(
												'should',
												A2(
													$elm$json$Json$Encode$list,
													$elm$json$Json$Encode$object,
													function () {
														var _v0 = model.z;
														if (!_v0) {
															return $author$project$NethysSearch$buildStandardQueryBody(model.i);
														} else {
															return $author$project$NethysSearch$buildElasticsearchQueryStringQueryBody(model.i);
														}
													}()))),
											$elm$core$List$isEmpty(
											$author$project$NethysSearch$buildSearchFilterTerms(model)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
											_Utils_Tuple2(
												'filter',
												A2(
													$elm$json$Json$Encode$list,
													$elm$json$Json$Encode$object,
													A2(
														$elm$core$List$map,
														$elm$core$List$singleton,
														$author$project$NethysSearch$buildSearchFilterTerms(model))))),
											$elm$core$List$isEmpty(
											$author$project$NethysSearch$buildSearchMustNotTerms(model)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
											_Utils_Tuple2(
												'must_not',
												A2(
													$elm$json$Json$Encode$list,
													$elm$json$Json$Encode$object,
													A2(
														$elm$core$List$map,
														$elm$core$List$singleton,
														$author$project$NethysSearch$buildSearchMustNotTerms(model))))),
											$elm$core$String$isEmpty(model.i) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
											_Utils_Tuple2(
												'minimum_should_match',
												$elm$json$Json$Encode$int(1)))
										])))
							])))),
				$elm$core$Maybe$Just(
				_Utils_Tuple2(
					'size',
					$elm$json$Json$Encode$int(50))),
				$elm$core$Maybe$Just(
				_Utils_Tuple2(
					'sort',
					A2(
						$elm$json$Json$Encode$list,
						$elm$core$Basics$identity,
						$elm$core$List$isEmpty(model.d) ? _List_fromArray(
							[
								$elm$json$Json$Encode$string('_score'),
								$elm$json$Json$Encode$string('_doc')
							]) : A2(
							$elm$core$List$append,
							A2(
								$elm$core$List$map,
								function (_v1) {
									var field = _v1.a;
									var dir = _v1.b;
									return $elm$json$Json$Encode$object(
										_List_fromArray(
											[
												_Utils_Tuple2(
												field,
												$elm$json$Json$Encode$object(
													_List_fromArray(
														[
															_Utils_Tuple2(
															'order',
															$elm$json$Json$Encode$string(
																$author$project$NethysSearch$sortDirToString(dir)))
														])))
											]));
								},
								model.d),
							_List_fromArray(
								[
									$elm$json$Json$Encode$string('id')
								]))))),
				$elm$core$Maybe$Just(
				_Utils_Tuple2(
					'_source',
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'excludes',
								A2(
									$elm$json$Json$Encode$list,
									$elm$json$Json$Encode$string,
									_List_fromArray(
										['text'])))
							])))),
				A2(
				$elm$core$Maybe$map,
				$elm$core$Tuple$pair('search_after'),
				A2(
					$elm$core$Maybe$map,
					function ($) {
						return $.d;
					},
					A2(
						$elm$core$Maybe$andThen,
						$elm_community$list_extra$List$Extra$last,
						A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.ab;
							},
							A2(
								$elm$core$Maybe$andThen,
								$elm$core$Result$toMaybe,
								$elm_community$list_extra$List$Extra$last(model.x))))))
			]));
};
var $elm$http$Http$Cancel = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {bY: reqs, b2: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 2};
var $elm$http$Http$Receiving = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Timeout_ = {$: 1};
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (!cmd.$) {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 1) {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.B;
							if (_v4.$ === 1) {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.bY));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.b2)));
	});
var $elm$http$Http$Request = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (!cmd.$) {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					b9: r.b9,
					cb: r.cb,
					cg: A2(_Http_mapExpect, func, r.cg),
					cl: r.cl,
					cs: r.cs,
					cK: r.cK,
					B: r.B,
					O: r.O
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$cancel = function (tracker) {
	return $elm$http$Http$command(
		$elm$http$Http$Cancel(tracker));
};
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$NethysSearch$stringListDecoder = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
			A2($elm$json$Json$Decode$map, $elm$core$List$singleton, $elm$json$Json$Decode$string)
		]));
var $author$project$NethysSearch$documentDecoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'category',
	$elm$json$Json$Decode$string,
	function (category) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'name',
			$elm$json$Json$Decode$string,
			function (name) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'type',
					$elm$json$Json$Decode$string,
					function (type_) {
						return A3(
							$webbhuset$elm_json_decode$Json$Decode$Field$require,
							'url',
							$elm$json$Json$Decode$string,
							function (url) {
								return A3(
									$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
									'ability',
									$author$project$NethysSearch$stringListDecoder,
									function (abilities) {
										return A3(
											$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
											'ability_type',
											$elm$json$Json$Decode$string,
											function (abilityType) {
												return A3(
													$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
													'ac',
													$elm$json$Json$Decode$int,
													function (ac) {
														return A3(
															$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
															'actions',
															$elm$json$Json$Decode$string,
															function (actions) {
																return A3(
																	$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																	'activate',
																	$elm$json$Json$Decode$string,
																	function (activate) {
																		return A3(
																			$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																			'advanced_domain_spell',
																			$elm$json$Json$Decode$string,
																			function (advancedDomainSpell) {
																				return A3(
																					$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																					'alignment',
																					$elm$json$Json$Decode$string,
																					function (alignment) {
																						return A3(
																							$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																							'ammunition',
																							$elm$json$Json$Decode$string,
																							function (ammunition) {
																								return A3(
																									$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																									'area',
																									$elm$json$Json$Decode$string,
																									function (area) {
																										return A3(
																											$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																											'aspect',
																											$elm$json$Json$Decode$string,
																											function (aspect) {
																												return A3(
																													$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																													'breadcrumbs',
																													$elm$json$Json$Decode$string,
																													function (breadcrumbs) {
																														return A3(
																															$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																															'bloodline',
																															$author$project$NethysSearch$stringListDecoder,
																															function (bloodlines) {
																																return A3(
																																	$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																	'bulk_raw',
																																	$elm$json$Json$Decode$string,
																																	function (bulk) {
																																		return A3(
																																			$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																			'cast',
																																			$elm$json$Json$Decode$string,
																																			function (cast) {
																																				return A3(
																																					$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																					'charisma',
																																					$elm$json$Json$Decode$int,
																																					function (charisma) {
																																						return A3(
																																							$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																							'component',
																																							$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
																																							function (components) {
																																								return A3(
																																									$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																									'constitution',
																																									$elm$json$Json$Decode$int,
																																									function (constitution) {
																																										return A3(
																																											$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																											'cost',
																																											$elm$json$Json$Decode$string,
																																											function (cost) {
																																												return A3(
																																													$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																													'creature_family',
																																													$elm$json$Json$Decode$string,
																																													function (creatureFamily) {
																																														return A3(
																																															$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																															'damage',
																																															$elm$json$Json$Decode$string,
																																															function (damage) {
																																																return A3(
																																																	$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																	'deity',
																																																	$author$project$NethysSearch$stringListDecoder,
																																																	function (deities) {
																																																		return A3(
																																																			$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																			'dexterity',
																																																			$elm$json$Json$Decode$int,
																																																			function (dexterity) {
																																																				return A3(
																																																					$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																					'divine_font',
																																																					$elm$json$Json$Decode$string,
																																																					function (divineFont) {
																																																						return A3(
																																																							$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																							'domain',
																																																							$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
																																																							function (domains) {
																																																								return A3(
																																																									$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																									'domain_spell',
																																																									$elm$json$Json$Decode$string,
																																																									function (domainSpell) {
																																																										return A3(
																																																											$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																											'duration',
																																																											$elm$json$Json$Decode$string,
																																																											function (duration) {
																																																												return A3(
																																																													$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																													'familiar_ability',
																																																													$author$project$NethysSearch$stringListDecoder,
																																																													function (familiarAbilities) {
																																																														return A3(
																																																															$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																															'favored_weapon',
																																																															$elm$json$Json$Decode$string,
																																																															function (favoredWeapon) {
																																																																return A3(
																																																																	$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																	'feat',
																																																																	$author$project$NethysSearch$stringListDecoder,
																																																																	function (feats) {
																																																																		return A3(
																																																																			$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																			'fortitude_save',
																																																																			$elm$json$Json$Decode$int,
																																																																			function (fort) {
																																																																				return A3(
																																																																					$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																					'frequency',
																																																																					$elm$json$Json$Decode$string,
																																																																					function (frequency) {
																																																																						return A3(
																																																																							$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																							'hands',
																																																																							$elm$json$Json$Decode$string,
																																																																							function (hands) {
																																																																								return A3(
																																																																									$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																									'heighten',
																																																																									$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
																																																																									function (heighten) {
																																																																										return A3(
																																																																											$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																											'hp',
																																																																											$elm$json$Json$Decode$int,
																																																																											function (hp) {
																																																																												return A3(
																																																																													$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																													'immunity',
																																																																													$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
																																																																													function (immunities) {
																																																																														return A3(
																																																																															$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																															'intelligence',
																																																																															$elm$json$Json$Decode$int,
																																																																															function (intelligence) {
																																																																																return A3(
																																																																																	$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																	'lesson_type',
																																																																																	$elm$json$Json$Decode$string,
																																																																																	function (lessonType) {
																																																																																		return A3(
																																																																																			$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																			'level',
																																																																																			$elm$json$Json$Decode$int,
																																																																																			function (level) {
																																																																																				return A3(
																																																																																					$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																					'mystery',
																																																																																					$author$project$NethysSearch$stringListDecoder,
																																																																																					function (mysteries) {
																																																																																						return A3(
																																																																																							$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																							'patron_theme',
																																																																																							$author$project$NethysSearch$stringListDecoder,
																																																																																							function (patronThemes) {
																																																																																								return A3(
																																																																																									$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																									'perception',
																																																																																									$elm$json$Json$Decode$int,
																																																																																									function (perception) {
																																																																																										return A3(
																																																																																											$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																											'prerequisite',
																																																																																											$elm$json$Json$Decode$string,
																																																																																											function (prerequisites) {
																																																																																												return A3(
																																																																																													$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																													'price_raw',
																																																																																													$elm$json$Json$Decode$string,
																																																																																													function (price) {
																																																																																														return A3(
																																																																																															$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																															'primaryCheck',
																																																																																															$elm$json$Json$Decode$string,
																																																																																															function (primaryCheck) {
																																																																																																return A3(
																																																																																																	$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																	'range_raw',
																																																																																																	$elm$json$Json$Decode$string,
																																																																																																	function (range) {
																																																																																																		return A3(
																																																																																																			$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																			'reflex_save',
																																																																																																			$elm$json$Json$Decode$int,
																																																																																																			function (ref) {
																																																																																																				return A3(
																																																																																																					$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																					'reload_raw',
																																																																																																					$elm$json$Json$Decode$string,
																																																																																																					function (reload) {
																																																																																																						return A3(
																																																																																																							$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																							'required_abilities',
																																																																																																							$elm$json$Json$Decode$string,
																																																																																																							function (requiredAbilities) {
																																																																																																								return A3(
																																																																																																									$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																									'requirement',
																																																																																																									$elm$json$Json$Decode$string,
																																																																																																									function (requirements) {
																																																																																																										return A3(
																																																																																																											$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																											'resistance_raw',
																																																																																																											$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
																																																																																																											function (resistances) {
																																																																																																												return A3(
																																																																																																													$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																													'saving_throw',
																																																																																																													$elm$json$Json$Decode$string,
																																																																																																													function (savingThrow) {
																																																																																																														return A3(
																																																																																																															$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																															'secondary_casters_raw',
																																																																																																															$elm$json$Json$Decode$string,
																																																																																																															function (secondaryCasters) {
																																																																																																																return A3(
																																																																																																																	$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																																	'secondary_check',
																																																																																																																	$elm$json$Json$Decode$string,
																																																																																																																	function (secondaryChecks) {
																																																																																																																		return A3(
																																																																																																																			$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																																			'skill',
																																																																																																																			$author$project$NethysSearch$stringListDecoder,
																																																																																																																			function (skills) {
																																																																																																																				return A3(
																																																																																																																					$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																																					'source',
																																																																																																																					$elm$json$Json$Decode$string,
																																																																																																																					function (source) {
																																																																																																																						return A3(
																																																																																																																							$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																																							'spell_list',
																																																																																																																							$elm$json$Json$Decode$string,
																																																																																																																							function (spellList) {
																																																																																																																								return A3(
																																																																																																																									$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																																									'spoilers',
																																																																																																																									$elm$json$Json$Decode$string,
																																																																																																																									function (spoilers) {
																																																																																																																										return A3(
																																																																																																																											$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																																											'strength',
																																																																																																																											$elm$json$Json$Decode$int,
																																																																																																																											function (strength) {
																																																																																																																												return A3(
																																																																																																																													$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																																													'target',
																																																																																																																													$elm$json$Json$Decode$string,
																																																																																																																													function (targets) {
																																																																																																																														return A3(
																																																																																																																															$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																																															'tradition',
																																																																																																																															$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
																																																																																																																															function (traditions) {
																																																																																																																																return A3(
																																																																																																																																	$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																																																	'trait_raw',
																																																																																																																																	$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
																																																																																																																																	function (maybeTraits) {
																																																																																																																																		return A3(
																																																																																																																																			$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																																																			'trigger',
																																																																																																																																			$elm$json$Json$Decode$string,
																																																																																																																																			function (trigger) {
																																																																																																																																				return A3(
																																																																																																																																					$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																																																					'usage',
																																																																																																																																					$elm$json$Json$Decode$string,
																																																																																																																																					function (usage) {
																																																																																																																																						return A3(
																																																																																																																																							$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																																																							'weakness_raw',
																																																																																																																																							$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
																																																																																																																																							function (weaknesses) {
																																																																																																																																								return A3(
																																																																																																																																									$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																																																									'weapon_category',
																																																																																																																																									$elm$json$Json$Decode$string,
																																																																																																																																									function (weaponCategory) {
																																																																																																																																										return A3(
																																																																																																																																											$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																																																											'weapon_group',
																																																																																																																																											$elm$json$Json$Decode$string,
																																																																																																																																											function (weaponGroup) {
																																																																																																																																												return A3(
																																																																																																																																													$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																																																													'will_save',
																																																																																																																																													$elm$json$Json$Decode$int,
																																																																																																																																													function (will) {
																																																																																																																																														return A3(
																																																																																																																																															$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
																																																																																																																																															'wisdom',
																																																																																																																																															$elm$json$Json$Decode$int,
																																																																																																																																															function (wisdom) {
																																																																																																																																																return $elm$json$Json$Decode$succeed(
																																																																																																																																																	{
																																																																																																																																																		aH: A2($elm$core$Maybe$withDefault, _List_Nil, abilities),
																																																																																																																																																		aI: abilityType,
																																																																																																																																																		aJ: ac,
																																																																																																																																																		aK: actions,
																																																																																																																																																		aL: activate,
																																																																																																																																																		aM: advancedDomainSpell,
																																																																																																																																																		bF: alignment,
																																																																																																																																																		aN: ammunition,
																																																																																																																																																		aO: area,
																																																																																																																																																		aP: aspect,
																																																																																																																																																		aQ: A2($elm$core$Maybe$withDefault, _List_Nil, bloodlines),
																																																																																																																																																		aR: breadcrumbs,
																																																																																																																																																		am: bulk,
																																																																																																																																																		an: cast,
																																																																																																																																																		ao: category,
																																																																																																																																																		aS: charisma,
																																																																																																																																																		aT: A2($elm$core$Maybe$withDefault, _List_Nil, components),
																																																																																																																																																		aU: constitution,
																																																																																																																																																		aV: cost,
																																																																																																																																																		aW: creatureFamily,
																																																																																																																																																		aX: damage,
																																																																																																																																																		aq: A2($elm$core$Maybe$withDefault, _List_Nil, deities),
																																																																																																																																																		aY: dexterity,
																																																																																																																																																		aZ: divineFont,
																																																																																																																																																		a_: domainSpell,
																																																																																																																																																		ar: A2($elm$core$Maybe$withDefault, _List_Nil, domains),
																																																																																																																																																		as: duration,
																																																																																																																																																		a$: A2($elm$core$Maybe$withDefault, _List_Nil, familiarAbilities),
																																																																																																																																																		a0: favoredWeapon,
																																																																																																																																																		a1: A2($elm$core$Maybe$withDefault, _List_Nil, feats),
																																																																																																																																																		a2: fort,
																																																																																																																																																		aa: frequency,
																																																																																																																																																		at: hands,
																																																																																																																																																		au: A2($elm$core$Maybe$withDefault, _List_Nil, heighten),
																																																																																																																																																		a4: hp,
																																																																																																																																																		a5: A2($elm$core$Maybe$withDefault, _List_Nil, immunities),
																																																																																																																																																		a6: intelligence,
																																																																																																																																																		a7: lessonType,
																																																																																																																																																		a8: level,
																																																																																																																																																		ba: A2($elm$core$Maybe$withDefault, _List_Nil, mysteries),
																																																																																																																																																		p: name,
																																																																																																																																																		bc: A2($elm$core$Maybe$withDefault, _List_Nil, patronThemes),
																																																																																																																																																		bd: perception,
																																																																																																																																																		ax: prerequisites,
																																																																																																																																																		ay: price,
																																																																																																																																																		bf: primaryCheck,
																																																																																																																																																		af: range,
																																																																																																																																																		bg: ref,
																																																																																																																																																		bh: reload,
																																																																																																																																																		bi: requiredAbilities,
																																																																																																																																																		ag: requirements,
																																																																																																																																																		bj: A2($elm$core$Maybe$withDefault, _List_Nil, resistances),
																																																																																																																																																		bl: savingThrow,
																																																																																																																																																		bm: secondaryCasters,
																																																																																																																																																		bn: secondaryChecks,
																																																																																																																																																		aD: A2($elm$core$Maybe$withDefault, _List_Nil, skills),
																																																																																																																																																		a: source,
																																																																																																																																																		aE: spellList,
																																																																																																																																																		bp: spoilers,
																																																																																																																																																		bs: strength,
																																																																																																																																																		aF: targets,
																																																																																																																																																		bu: A2($elm$core$Maybe$withDefault, _List_Nil, traditions),
																																																																																																																																																		bv: A2($elm$core$Maybe$withDefault, _List_Nil, maybeTraits),
																																																																																																																																																		Y: trigger,
																																																																																																																																																		bw: type_,
																																																																																																																																																		O: url,
																																																																																																																																																		bx: usage,
																																																																																																																																																		by: A2($elm$core$Maybe$withDefault, _List_Nil, weaknesses),
																																																																																																																																																		bz: weaponCategory,
																																																																																																																																																		bA: weaponGroup,
																																																																																																																																																		bB: will,
																																																																																																																																																		bC: wisdom
																																																																																																																																																	});
																																																																																																																																															});
																																																																																																																																													});
																																																																																																																																											});
																																																																																																																																									});
																																																																																																																																							});
																																																																																																																																					});
																																																																																																																																			});
																																																																																																																																	});
																																																																																																																															});
																																																																																																																													});
																																																																																																																											});
																																																																																																																									});
																																																																																																																							});
																																																																																																																					});
																																																																																																																			});
																																																																																																																	});
																																																																																																															});
																																																																																																													});
																																																																																																											});
																																																																																																									});
																																																																																																							});
																																																																																																					});
																																																																																																			});
																																																																																																	});
																																																																																															});
																																																																																													});
																																																																																											});
																																																																																									});
																																																																																							});
																																																																																					});
																																																																																			});
																																																																																	});
																																																																															});
																																																																													});
																																																																											});
																																																																									});
																																																																							});
																																																																					});
																																																																			});
																																																																	});
																																																															});
																																																													});
																																																											});
																																																									});
																																																							});
																																																					});
																																																			});
																																																	});
																																															});
																																													});
																																											});
																																									});
																																							});
																																					});
																																			});
																																	});
																															});
																													});
																											});
																									});
																							});
																					});
																			});
																	});
															});
													});
											});
									});
							});
					});
			});
	});
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$NethysSearch$hitDecoder = function (decoder) {
	return A3(
		$webbhuset$elm_json_decode$Json$Decode$Field$require,
		'_id',
		$elm$json$Json$Decode$string,
		function (id) {
			return A3(
				$webbhuset$elm_json_decode$Json$Decode$Field$require,
				'_score',
				$elm$json$Json$Decode$maybe($elm$json$Json$Decode$float),
				function (score) {
					return A3(
						$webbhuset$elm_json_decode$Json$Decode$Field$require,
						'_source',
						decoder,
						function (source) {
							return A3(
								$webbhuset$elm_json_decode$Json$Decode$Field$require,
								'sort',
								$elm$json$Json$Decode$value,
								function (sort) {
									return $elm$json$Json$Decode$succeed(
										{
											av: id,
											b0: A2($elm$core$Maybe$withDefault, 0, score),
											d: sort,
											a: source
										});
								});
						});
				});
		});
};
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $webbhuset$elm_json_decode$Json$Decode$Field$requireAt = F3(
	function (path, valueDecoder, continuation) {
		return A2(
			$elm$json$Json$Decode$andThen,
			continuation,
			A2($elm$json$Json$Decode$at, path, valueDecoder));
	});
var $author$project$NethysSearch$esResultDecoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$requireAt,
	_List_fromArray(
		['hits', 'hits']),
	$elm$json$Json$Decode$list(
		$author$project$NethysSearch$hitDecoder($author$project$NethysSearch$documentDecoder)),
	function (hits) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$requireAt,
			_List_fromArray(
				['hits', 'total', 'value']),
			$elm$json$Json$Decode$int,
			function (total) {
				return $elm$json$Json$Decode$succeed(
					{ab: hits, bt: total});
			});
	});
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$http$Http$BadBody = function (a) {
	return {$: 4, a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 3, a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$NetworkError = {$: 2};
var $elm$http$Http$Timeout = {$: 1};
var $elm$http$Http$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 0:
				var url = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadUrl(url));
			case 1:
				return $elm$core$Result$Err($elm$http$Http$Timeout);
			case 2:
				return $elm$core$Result$Err($elm$http$Http$NetworkError);
			case 3:
				var metadata = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadStatus(metadata.cG));
			default:
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$http$Http$BadBody,
					toResult(body));
		}
	});
var $elm$http$Http$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			$elm$http$Http$resolve(
				function (string) {
					return A2(
						$elm$core$Result$mapError,
						$elm$json$Json$Decode$errorToString,
						A2($elm$json$Json$Decode$decodeString, decoder, string));
				}));
	});
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
};
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{b9: false, cb: r.cb, cg: r.cg, cl: r.cl, cs: r.cs, cK: r.cK, B: r.B, O: r.O}));
};
var $elm$core$String$trim = _String_trim;
var $author$project$NethysSearch$searchWithCurrentQuery = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	if ($elm$core$String$isEmpty(
		$elm$core$String$trim(model.i)) && ($elm$core$Set$isEmpty(model.b) && $elm$core$Set$isEmpty(model.c))) {
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{x: _List_Nil}),
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						cmd,
						function () {
						var _v1 = model.B;
						if (!_v1.$) {
							var tracker = _v1.a;
							return $elm$http$Http$cancel(
								'search-' + $elm$core$String$fromInt(tracker));
						} else {
							return $elm$core$Platform$Cmd$none;
						}
					}()
					])));
	} else {
		var newTracker = function () {
			var _v3 = model.B;
			if (!_v3.$) {
				var tracker = _v3.a;
				return tracker + 1;
			} else {
				return 1;
			}
		}();
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					B: $elm$core$Maybe$Just(newTracker)
				}),
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						cmd,
						function () {
						var _v2 = model.B;
						if (!_v2.$) {
							var tracker = _v2.a;
							return $elm$http$Http$cancel(
								'search-' + $elm$core$String$fromInt(tracker));
						} else {
							return $elm$core$Platform$Cmd$none;
						}
					}(),
						$elm$http$Http$request(
						{
							cb: $elm$http$Http$jsonBody(
								$author$project$NethysSearch$buildSearchBody(model)),
							cg: A2($elm$http$Http$expectJson, $author$project$NethysSearch$GotSearchResult, $author$project$NethysSearch$esResultDecoder),
							cl: _List_Nil,
							cs: 'POST',
							cK: $elm$core$Maybe$Just(10000),
							B: $elm$core$Maybe$Just(
								'search-' + $elm$core$String$fromInt(newTracker)),
							O: model.H + '/_search'
						})
					])));
	}
};
var $author$project$NethysSearch$ElasticsearchQueryString = 1;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$filter = F2(
	function (isGood, dict) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, d) {
					return A2(isGood, k, v) ? A3($elm$core$Dict$insert, k, v, d) : d;
				}),
			$elm$core$Dict$empty,
			dict);
	});
var $elm$core$Set$filter = F2(
	function (isGood, _v0) {
		var dict = _v0;
		return A2(
			$elm$core$Dict$filter,
			F2(
				function (key, _v1) {
					return isGood(key);
				}),
			dict);
	});
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $elm_community$maybe_extra$Maybe$Extra$join = function (mx) {
	if (!mx.$) {
		var x = mx.a;
		return x;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {I: frag, J: params, G: unvisited, C: value, P: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.G;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.C);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.C);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 1) {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 1) {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 1) {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 1) {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.bT),
					$elm$url$Url$Parser$prepareQuery(url.i),
					url.ck,
					$elm$core$Basics$identity)));
	});
var $elm$url$Url$Parser$Parser = $elm$core$Basics$identity;
var $elm$url$Url$Parser$query = function (_v0) {
	var queryParser = _v0;
	return function (_v1) {
		var visited = _v1.P;
		var unvisited = _v1.G;
		var params = _v1.J;
		var frag = _v1.I;
		var value = _v1.C;
		return _List_fromArray(
			[
				A5(
				$elm$url$Url$Parser$State,
				visited,
				unvisited,
				params,
				frag,
				value(
					queryParser(params)))
			]);
	};
};
var $elm$url$Url$Parser$Internal$Parser = $elm$core$Basics$identity;
var $elm$url$Url$Parser$Query$custom = F2(
	function (key, func) {
		return function (dict) {
			return func(
				A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					A2($elm$core$Dict$get, key, dict)));
		};
	});
var $elm$url$Url$Parser$Query$string = function (key) {
	return A2(
		$elm$url$Url$Parser$Query$custom,
		key,
		function (stringList) {
			if (stringList.b && (!stringList.b.b)) {
				var str = stringList.a;
				return $elm$core$Maybe$Just(str);
			} else {
				return $elm$core$Maybe$Nothing;
			}
		});
};
var $author$project$NethysSearch$getQueryParam = F2(
	function (url, param) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			$elm_community$maybe_extra$Maybe$Extra$join(
				A2(
					$elm$url$Url$Parser$parse,
					$elm$url$Url$Parser$query(
						$elm$url$Url$Parser$Query$string(param)),
					_Utils_update(
						url,
						{bT: ''}))));
	});
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm_community$string_extra$String$Extra$nonEmpty = function (string) {
	return $elm$core$String$isEmpty(string) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(string);
};
var $elm_community$maybe_extra$Maybe$Extra$or = F2(
	function (ma, mb) {
		if (ma.$ === 1) {
			return mb;
		} else {
			return ma;
		}
	});
var $author$project$NethysSearch$Asc = 0;
var $author$project$NethysSearch$Desc = 1;
var $author$project$NethysSearch$sortDirFromString = function (str) {
	switch (str) {
		case 'asc':
			return $elm$core$Maybe$Just(0);
		case 'desc':
			return $elm$core$Maybe$Just(1);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $elm_community$list_extra$List$Extra$find = F2(
	function (predicate, list) {
		find:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var first = list.a;
				var rest = list.b;
				if (predicate(first)) {
					return $elm$core$Maybe$Just(first);
				} else {
					var $temp$predicate = predicate,
						$temp$list = rest;
					predicate = $temp$predicate;
					list = $temp$list;
					continue find;
				}
			}
		}
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Data$damageTypes = _List_fromArray(
	['acid', 'all', 'area', 'bleed', 'bludgeoning', 'chaotic', 'cold', 'cold_iron', 'electricity', 'evil', 'fire', 'force', 'good', 'lawful', 'mental', 'negative', 'orichalcum', 'physical', 'piercing', 'poison', 'positive', 'precision', 'silver', 'slashing', 'sonic', 'splash']);
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$core$String$append = _String_append;
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {cp: index, cr: match, cu: number, cI: submatches};
	});
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{cc: false, ct: false},
		string);
};
var $elm$regex$Regex$never = _Regex_never;
var $elm_community$string_extra$String$Extra$regexFromString = A2(
	$elm$core$Basics$composeR,
	$elm$regex$Regex$fromString,
	$elm$core$Maybe$withDefault($elm$regex$Regex$never));
var $elm$regex$Regex$replace = _Regex_replaceAtMost(_Regex_infinity);
var $elm$core$String$toLower = _String_toLower;
var $elm$core$String$cons = _String_cons;
var $elm_community$string_extra$String$Extra$changeCase = F2(
	function (mutator, word) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				function (_v0) {
					var head = _v0.a;
					var tail = _v0.b;
					return A2(
						$elm$core$String$cons,
						mutator(head),
						tail);
				},
				$elm$core$String$uncons(word)));
	});
var $elm$core$Char$toUpper = _Char_toUpper;
var $elm_community$string_extra$String$Extra$toSentenceCase = function (word) {
	return A2($elm_community$string_extra$String$Extra$changeCase, $elm$core$Char$toUpper, word);
};
var $elm_community$string_extra$String$Extra$humanize = function (string) {
	return $elm_community$string_extra$String$Extra$toSentenceCase(
		$elm$core$String$toLower(
			$elm$core$String$trim(
				A3(
					$elm$regex$Regex$replace,
					$elm_community$string_extra$String$Extra$regexFromString('_id$|[-_\\s]+'),
					$elm$core$Basics$always(' '),
					A3(
						$elm$regex$Regex$replace,
						$elm_community$string_extra$String$Extra$regexFromString('[A-Z]+'),
						A2(
							$elm$core$Basics$composeR,
							function ($) {
								return $.cr;
							},
							$elm$core$String$append('-')),
						string)))));
};
var $author$project$Data$sortFields = A2(
	$elm$core$List$append,
	A2(
		$elm$core$List$map,
		function (type_) {
			return _Utils_Tuple2(
				'weakness.' + type_,
				$elm_community$string_extra$String$Extra$humanize(type_) + ' weakness');
		},
		$author$project$Data$damageTypes),
	A2(
		$elm$core$List$append,
		A2(
			$elm$core$List$map,
			function (type_) {
				return _Utils_Tuple2(
					'resistance.' + type_,
					$elm_community$string_extra$String$Extra$humanize(type_) + ' resistance');
			},
			$author$project$Data$damageTypes),
		_List_fromArray(
			[
				_Utils_Tuple2('ac', 'AC'),
				_Utils_Tuple2('bulk', 'Bulk'),
				_Utils_Tuple2('charisma', 'Charisma'),
				_Utils_Tuple2('constitution', 'Constitution'),
				_Utils_Tuple2('dexterity', 'Dexterity'),
				_Utils_Tuple2('fortitude_save', 'Fortitude'),
				_Utils_Tuple2('hp', 'HP'),
				_Utils_Tuple2('intelligence', 'Intelligence'),
				_Utils_Tuple2('level', 'Level'),
				_Utils_Tuple2('name.keyword', 'Name'),
				_Utils_Tuple2('perception', 'Perception'),
				_Utils_Tuple2('price', 'Price'),
				_Utils_Tuple2('range', 'Range'),
				_Utils_Tuple2('reflex_save', 'Reflex'),
				_Utils_Tuple2('strength', 'Strength'),
				_Utils_Tuple2('type', 'Type'),
				_Utils_Tuple2('will_save', 'Will'),
				_Utils_Tuple2('wisdom', 'Wisdom')
			])));
var $author$project$NethysSearch$sortFieldFromLabel = function (field) {
	return A2(
		$elm$core$Maybe$map,
		$elm$core$Tuple$first,
		A2(
			$elm_community$list_extra$List$Extra$find,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Tuple$second,
				$elm$core$Basics$eq(field)),
			$author$project$Data$sortFields));
};
var $author$project$Data$traits = _List_fromArray(
	['Aasimar', 'Aberration', 'Abjuration', 'Acid', 'Additive', 'Adjustment', 'Aeon', 'Aesir', 'Agathion', 'Agile', 'Air', 'Alchemical', 'Alchemist', 'Amphibious', 'Anadi', 'Android', 'Angel', 'Animal', 'Anugobu', 'Any', 'Apex', 'Aphorite', 'Aquatic', 'Arcane', 'Archetype', 'Archon', 'Artifact', 'Astral', 'Asura', 'Attached', 'Attack', 'Auditory', 'Aura', 'Automaton', 'Azarketi', 'Azata', 'Backstabber', 'Backswing', 'Barbarian', 'Bard', 'Beast', 'Beastkin', 'Boggard', 'Bomb', 'Bulwark', 'CE', 'CG', 'CN', 'Caligni', 'Cantrip', 'Capacity', 'Catalyst', 'Catfolk', 'Celestial', 'Champion', 'Changeling', 'Chaotic', 'Charau-ka', 'Circus', 'Class', 'Cleric', 'Climbing', 'Clockwork', 'Cobbled', 'Cold', 'Comfort', 'Companion', 'Composition', 'Concealable', 'Concentrate', 'Concussive', 'Conjuration', 'Conrasu', 'Consecration', 'Construct', 'Consumable', 'Contact', 'Contingency', 'Contract', 'Couatl', 'Critical Fusion', 'Curse', 'Cursebound', 'Cursed', 'Daemon', 'Darkness', 'Deadly', 'Death', 'Dedication', 'Demon', 'Dero', 'Detection', 'Devil', 'Dhampir', 'Dinosaur', 'Disarm', 'Disease', 'Div', 'Divination', 'Divine', 'Double Barrel', 'Downtime', 'Dragon', 'Dream', 'Drow', 'Drug', 'Druid', 'Duergar', 'Duskwalker', 'Dwarf', 'Earth', 'Eidolon', 'Electricity', 'Elemental', 'Elf', 'Elixir', 'Emotion', 'Enchantment', 'Erratic', 'Ethereal', 'Evil', 'Evocation', 'Evolution', 'Exploration', 'Extradimensional', 'Fatal', 'Fatal Aim', 'Fear', 'Fetchling', 'Fey', 'Fiend', 'Fighter', 'Finesse', 'Finisher', 'Fire', 'Fleshwarp', 'Flexible', 'Flourish', 'Flowing', 'Focused', 'Force', 'Forceful', 'Formian', 'Fortune', 'Free-Hand', 'Fulu', 'Fungus', 'Gadget', 'Ganzi', 'Gargantuan', 'General', 'Genie', 'Geniekin', 'Ghoran', 'Ghost', 'Ghoul', 'Giant', 'Gnoll', 'Gnome', 'Goblin', 'Golem', 'Goloma', 'Good', 'Grapple', 'Gremlin', 'Grimoire', 'Grioth', 'Grippli', 'Gunslinger', 'Hag', 'Half-Elf', 'Half-Orc', 'Halfling', 'Hampering', 'Hantu', 'Healing', 'Herald', 'Hex', 'Hobgoblin', 'Huge', 'Human', 'Humanoid', 'Ifrit', 'Ikeshti', 'Illusion', 'Incapacitation', 'Incarnate', 'Incorporeal', 'Inevitable', 'Ingested', 'Inhaled', 'Injection', 'Injury', 'Instinct', 'Intelligent', 'Inventor', 'Invested', 'Investigator', 'Jousting', 'Kami', 'Kickback', 'Kitsune', 'Kobold', 'Kovintus', 'LE', 'LG', 'LN', 'Large', 'Lawful', 'Legacy', 'Leshy', 'Light', 'Lineage', 'Linguistic', 'Litany', 'Lizardfolk', 'Locathah', 'Magical', 'Magus', 'Manipulate', 'Mechanical', 'Medium', 'Mental', 'Merfolk', 'Metamagic', 'Metamorphic', 'Mindless', 'Minion', 'Misfortune', 'Modification', 'Modular', 'Monitor', 'Monk', 'Morlock', 'Morph', 'Mortic', 'Mounted', 'Move', 'Multiclass', 'Mummy', 'Munavri', 'Mutagen', 'Mutant', 'N', 'NE', 'NG', 'Nagaji', 'Necromancy', 'Negative', 'No Alignment', 'Noisy', 'Nonlethal', 'Nymph', 'Oath', 'Occult', 'Oil', 'Olfactory', 'Oni', 'Ooze', 'Open', 'Oracle', 'Orc', 'Oread', 'Paaridar', 'Parry', 'Pervasive Magic', 'Petitioner', 'Phantom', 'Plant', 'Poison', 'Polymorph', 'Portable', 'Positive', 'Possession', 'Potion', 'Precious', 'Prediction', 'Press', 'Primal', 'Propulsive', 'Protean', 'Psychopomp', 'Qlippoth', 'Rage', 'Rakshasa', 'Ranged Trip', 'Ranger', 'Rare', 'Ratfolk', 'Reach', 'Reckless', 'Repeating', 'Resonant', 'Revelation', 'Rogue', 'Saggorak', 'Sahkil', 'Samsaran', 'Scatter', 'Scroll', 'Scrying', 'Sea Devil', 'Secret', 'Serpentfolk', 'Seugathi', 'Shabti', 'Shadow', 'Shisk', 'Shoony', 'Shove', 'Siktempora', 'Skeleton', 'Skelm', 'Skill', 'Skulk', 'Sleep', 'Small', 'Snare', 'Social', 'Sonic', 'Sorcerer', 'Soulbound', 'Spellheart', 'Spellshot', 'Spirit', 'Splash', 'Spriggan', 'Sprite', 'Staff', 'Stamina', 'Stance', 'Static', 'Steam', 'Stheno', 'Strix', 'Structure', 'Subjective Gravity', 'Suli', 'Summoner', 'Swarm', 'Swashbuckler', 'Sweep', 'Sylph', 'Talisman', 'Tandem', 'Tane', 'Tanggal', 'Tattoo', 'Teleportation', 'Tengu', 'Tethered', 'Thrown', 'Tiefling', 'Time', 'Timeless', 'Tiny', 'Titan', 'Transmutation', 'Trap', 'Trip', 'Troll', 'Troop', 'True Name', 'Twin', 'Two-Hand', 'Unarmed', 'Unbounded', 'Uncommon', 'Undead', 'Undine', 'Unique', 'Unstable', 'Urdefhan', 'Vampire', 'Vanara', 'Velstrac', 'Versatile', 'Vigilante', 'Virulent', 'Vishkanya', 'Visual', 'Volley', 'Wand', 'Water', 'Wayang', 'Werecreature', 'Wight', 'Witch', 'Wizard', 'Wraith', 'Wyrwood', 'Xulgath', 'Zombie']);
var $author$project$Data$types = _List_fromArray(
	['Action', 'Alchemist Research Field', 'Ancestry', 'Animal Companion', 'Animal Companion Advanced Option', 'Animal Companion Specialization', 'Archetype', 'Armor Specialization', 'Armor', 'Background', 'Barbarian Instinct', 'Bard Muse', 'Cantrip', 'Champion Cause', 'Champion Tenet', 'Class', 'Class Kit', 'Class Sample', 'Cleric Doctrine', 'Condition', 'Creature', 'Creature Ability', 'Creature Family', 'Creature Theme Template', 'Curse', 'Deity', 'Disease', 'Domain', 'Druidic Order', 'Familiar Ability', 'Feat', 'Focus', 'Grand Gift', 'Gunslinger Way', 'Hazard', 'Heritage', 'Hunter\'s Edge', 'Inventor Innovation', 'Investigator Methodology', 'Item', 'Language', 'Magus Hybrid Study', 'Major Gift', 'Minor Gift', 'Oracle Mystery', 'Plane', 'Ritual', 'Rogue Racket', 'Rules', 'Shield', 'Skill', 'Sorcerer Bloodline', 'Source', 'Specific Familiar', 'Spell', 'Summoner Eidolon', 'Swashbuckler Style', 'Trait', 'Unique Animal Companion', 'Vehicle', 'Weapon Critical Specialization', 'Weapon', 'Witch Lesson', 'Witch Patron Theme', 'Wizard Arcane School']);
var $author$project$NethysSearch$updateModelFromQueryString = F2(
	function (url, model) {
		return _Utils_update(
			model,
			{
				b: A2(
					$elm$core$Maybe$withDefault,
					$elm$core$Set$empty,
					A2(
						$elm$core$Maybe$map,
						$elm$core$Set$filter(
							function (v) {
								return A2($elm$core$List$member, v, $author$project$Data$traits);
							}),
						A2(
							$elm$core$Maybe$map,
							$elm$core$Set$fromList,
							A2(
								$elm$core$Maybe$map,
								$elm$core$String$split(','),
								A2(
									$elm_community$maybe_extra$Maybe$Extra$or,
									$elm_community$string_extra$String$Extra$nonEmpty(
										A2($author$project$NethysSearch$getQueryParam, url, 'include-traits')),
									$elm_community$string_extra$String$Extra$nonEmpty(
										A2($author$project$NethysSearch$getQueryParam, url, 'exclude-traits'))))))),
				c: A2(
					$elm$core$Maybe$withDefault,
					$elm$core$Set$empty,
					A2(
						$elm$core$Maybe$map,
						$elm$core$Set$filter(
							function (v) {
								return A2($elm$core$List$member, v, $author$project$Data$types);
							}),
						A2(
							$elm$core$Maybe$map,
							$elm$core$Set$fromList,
							A2(
								$elm$core$Maybe$map,
								$elm$core$String$split(','),
								A2(
									$elm_community$maybe_extra$Maybe$Extra$or,
									$elm_community$string_extra$String$Extra$nonEmpty(
										A2($author$project$NethysSearch$getQueryParam, url, 'include-types')),
									$elm_community$string_extra$String$Extra$nonEmpty(
										A2($author$project$NethysSearch$getQueryParam, url, 'exclude-types'))))))),
				l: A2(
					$elm$core$Maybe$withDefault,
					model.l,
					A2(
						$elm_community$maybe_extra$Maybe$Extra$or,
						A2(
							$elm$core$Maybe$map,
							function (_v0) {
								return true;
							},
							$elm_community$string_extra$String$Extra$nonEmpty(
								A2($author$project$NethysSearch$getQueryParam, url, 'include-traits'))),
						A2(
							$elm$core$Maybe$map,
							function (_v1) {
								return false;
							},
							$elm_community$string_extra$String$Extra$nonEmpty(
								A2($author$project$NethysSearch$getQueryParam, url, 'exclude-traits'))))),
				m: A2(
					$elm$core$Maybe$withDefault,
					model.m,
					A2(
						$elm_community$maybe_extra$Maybe$Extra$or,
						A2(
							$elm$core$Maybe$map,
							function (_v2) {
								return true;
							},
							$elm_community$string_extra$String$Extra$nonEmpty(
								A2($author$project$NethysSearch$getQueryParam, url, 'include-types'))),
						A2(
							$elm$core$Maybe$map,
							function (_v3) {
								return false;
							},
							$elm_community$string_extra$String$Extra$nonEmpty(
								A2($author$project$NethysSearch$getQueryParam, url, 'exclude-types'))))),
				i: A2($author$project$NethysSearch$getQueryParam, url, 'q'),
				z: function () {
					var _v4 = A2($author$project$NethysSearch$getQueryParam, url, 'type');
					if (_v4 === 'eqs') {
						return 1;
					} else {
						return 0;
					}
				}(),
				x: _List_Nil,
				d: A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					A2(
						$elm$core$Maybe$map,
						$elm$core$List$filterMap(
							function (str) {
								var _v5 = A2($elm$core$String$split, '-', str);
								if ((_v5.b && _v5.b.b) && (!_v5.b.b.b)) {
									var field = _v5.a;
									var _v6 = _v5.b;
									var dir = _v6.a;
									return A3(
										$elm$core$Maybe$map2,
										$elm$core$Tuple$pair,
										$author$project$NethysSearch$sortFieldFromLabel(field),
										$author$project$NethysSearch$sortDirFromString(dir));
								} else {
									return $elm$core$Maybe$Nothing;
								}
							}),
						A2(
							$elm$core$Maybe$map,
							$elm$core$String$split(','),
							$elm_community$string_extra$String$Extra$nonEmpty(
								A2($author$project$NethysSearch$getQueryParam, url, 'sort')))))
			});
	});
var $author$project$NethysSearch$document_setTitle = _Platform_outgoingPort('document_setTitle', $elm$json$Json$Encode$string);
var $author$project$NethysSearch$updateTitle = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	return _Utils_Tuple2(
		model,
		$elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					cmd,
					$author$project$NethysSearch$document_setTitle(model.i)
				])));
};
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$NethysSearch$init = function (flagsValue) {
	var flags = A2(
		$elm$core$Result$withDefault,
		$author$project$NethysSearch$defaultFlags,
		A2($elm$json$Json$Decode$decodeValue, $author$project$NethysSearch$flagsDecoder, flagsValue));
	var url = $author$project$NethysSearch$parseUrl(flags.ap);
	return $author$project$NethysSearch$updateTitle(
		$author$project$NethysSearch$searchWithCurrentQuery(
			_Utils_Tuple2(
				A2(
					$author$project$NethysSearch$updateModelFromQueryString,
					url,
					{Q: 0, H: flags.H, S: false, b: $elm$core$Set$empty, c: $elm$core$Set$empty, l: true, m: true, ad: false, T: false, i: '', az: 0, U: false, z: 0, x: _List_Nil, V: '', W: '', aA: 'strength', aB: 'acid', aC: 'acid', A: flags.A, L: true, M: true, N: true, d: _List_Nil, j: 0, B: $elm$core$Maybe$Nothing, O: url}),
				$elm$core$Platform$Cmd$batch(
					_List_fromArray(
						[
							$author$project$NethysSearch$localStorage_get('show-additional-info'),
							$author$project$NethysSearch$localStorage_get('show-spoilers'),
							$author$project$NethysSearch$localStorage_get('show-traits'),
							$author$project$NethysSearch$localStorage_get('theme'),
							$author$project$NethysSearch$getQueryOptionsHeight
						])))));
};
var $author$project$NethysSearch$GotQueryOptionsHeight = function (a) {
	return {$: 1, a: a};
};
var $author$project$NethysSearch$LocalStorageValueReceived = function (a) {
	return {$: 6, a: a};
};
var $author$project$NethysSearch$NoOp = {$: 8};
var $author$project$NethysSearch$UrlChanged = function (a) {
	return {$: 33, a: a};
};
var $author$project$NethysSearch$WindowResized = F2(
	function (a, b) {
		return {$: 35, a: a, b: b};
	});
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $author$project$NethysSearch$document_receiveNodeHeight = _Platform_incomingPort(
	'document_receiveNodeHeight',
	A2(
		$elm$json$Json$Decode$andThen,
		function (id) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (height) {
					return $elm$json$Json$Decode$succeed(
						{bN: height, av: id});
				},
				A2($elm$json$Json$Decode$field, 'height', $elm$json$Json$Decode$float));
		},
		A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$string)));
var $author$project$NethysSearch$localStorage_receive = _Platform_incomingPort('localStorage_receive', $elm$json$Json$Decode$value);
var $author$project$NethysSearch$navigation_urlChanged = _Platform_incomingPort('navigation_urlChanged', $elm$json$Json$Decode$string);
var $elm$browser$Browser$Events$Window = 1;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {bU: pids, b2: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {bK: event, bQ: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.bU,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.bQ;
		var event = _v0.bK;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.b2);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onResize = function (func) {
	return A3(
		$elm$browser$Browser$Events$on,
		1,
		'resize',
		A2(
			$elm$json$Json$Decode$field,
			'target',
			A3(
				$elm$json$Json$Decode$map2,
				func,
				A2($elm$json$Json$Decode$field, 'innerWidth', $elm$json$Json$Decode$int),
				A2($elm$json$Json$Decode$field, 'innerHeight', $elm$json$Json$Decode$int))));
};
var $elm$core$Basics$round = _Basics_round;
var $author$project$NethysSearch$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onResize($author$project$NethysSearch$WindowResized),
				$author$project$NethysSearch$document_receiveNodeHeight(
				function (_v0) {
					var id = _v0.av;
					var height = _v0.bN;
					return _Utils_eq(id, $author$project$NethysSearch$queryOptionsDummyId) ? $author$project$NethysSearch$GotQueryOptionsHeight(
						$elm$core$Basics$round(height)) : $author$project$NethysSearch$NoOp;
				}),
				$author$project$NethysSearch$localStorage_receive($author$project$NethysSearch$LocalStorageValueReceived),
				$author$project$NethysSearch$navigation_urlChanged($author$project$NethysSearch$UrlChanged)
			]));
};
var $author$project$NethysSearch$DebouncePassed = function (a) {
	return {$: 0, a: a};
};
var $author$project$NethysSearch$ExtraContrast = 1;
var $author$project$NethysSearch$Lavender = 2;
var $author$project$NethysSearch$Light = 3;
var $author$project$NethysSearch$MenuOpenDelayPassed = {$: 7};
var $author$project$NethysSearch$Paper = 4;
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm_community$result_extra$Result$Extra$isOk = function (x) {
	if (!x.$) {
		return true;
	} else {
		return false;
	}
};
var $author$project$NethysSearch$navigation_loadUrl = _Platform_outgoingPort('navigation_loadUrl', $elm$json$Json$Encode$string);
var $author$project$NethysSearch$navigation_pushUrl = _Platform_outgoingPort('navigation_pushUrl', $elm$json$Json$Encode$string);
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$remove, key, dict);
	});
var $author$project$NethysSearch$localStorage_set = _Platform_outgoingPort('localStorage_set', $elm$core$Basics$identity);
var $author$project$NethysSearch$saveToLocalStorage = F2(
	function (key, value) {
		return $author$project$NethysSearch$localStorage_set(
			$elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'key',
						$elm$json$Json$Encode$string(key)),
						_Utils_Tuple2(
						'value',
						$elm$json$Json$Encode$string(value))
					])));
	});
var $elm$browser$Browser$Dom$setViewport = _Browser_setViewport;
var $elm$core$Process$sleep = _Process_sleep;
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 1) {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 1) {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.cB;
		if (!_v0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.ck,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.i,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.cz,
					_Utils_ap(http, url.cn)),
				url.bT)));
};
var $author$project$NethysSearch$sortFieldToLabel = function (field) {
	return A2(
		$elm$core$Maybe$withDefault,
		field,
		A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$second,
			A2(
				$elm_community$list_extra$List$Extra$find,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Tuple$first,
					$elm$core$Basics$eq(field)),
				$author$project$Data$sortFields)));
};
var $elm$url$Url$Builder$QueryParameter = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $elm$url$Url$Builder$string = F2(
	function (key, value) {
		return A2(
			$elm$url$Url$Builder$QueryParameter,
			$elm$url$Url$percentEncode(key),
			$elm$url$Url$percentEncode(value));
	});
var $elm$url$Url$Builder$toQueryPair = function (_v0) {
	var key = _v0.a;
	var value = _v0.b;
	return key + ('=' + value);
};
var $elm$url$Url$Builder$toQuery = function (parameters) {
	if (!parameters.b) {
		return '';
	} else {
		return '?' + A2(
			$elm$core$String$join,
			'&',
			A2($elm$core$List$map, $elm$url$Url$Builder$toQueryPair, parameters));
	}
};
var $author$project$NethysSearch$updateUrl = function (model) {
	var url = model.O;
	return $author$project$NethysSearch$navigation_pushUrl(
		$elm$url$Url$toString(
			_Utils_update(
				url,
				{
					i: $elm_community$string_extra$String$Extra$nonEmpty(
						A2(
							$elm$core$String$dropLeft,
							1,
							$elm$url$Url$Builder$toQuery(
								A2(
									$elm$core$List$map,
									function (_v2) {
										var key = _v2.a;
										var val = _v2.b;
										return A2($elm$url$Url$Builder$string, key, val);
									},
									A2(
										$elm$core$List$filter,
										A2(
											$elm$core$Basics$composeR,
											$elm$core$Tuple$second,
											A2($elm$core$Basics$composeR, $elm$core$String$isEmpty, $elm$core$Basics$not)),
										_List_fromArray(
											[
												_Utils_Tuple2('q', model.i),
												_Utils_Tuple2(
												'type',
												function () {
													var _v0 = model.z;
													if (!_v0) {
														return '';
													} else {
														return 'eqs';
													}
												}()),
												_Utils_Tuple2(
												model.m ? 'include-types' : 'exclude-types',
												A2(
													$elm$core$String$join,
													',',
													$elm$core$Set$toList(model.c))),
												_Utils_Tuple2(
												model.l ? 'include-traits' : 'exclude-traits',
												A2(
													$elm$core$String$join,
													',',
													$elm$core$Set$toList(model.b))),
												_Utils_Tuple2(
												'sort',
												A2(
													$elm$core$String$join,
													',',
													A2(
														$elm$core$List$map,
														function (_v1) {
															var field = _v1.a;
															var dir = _v1.b;
															return $author$project$NethysSearch$sortFieldToLabel(field) + ('-' + $author$project$NethysSearch$sortDirToString(dir));
														},
														model.d)))
											]))))))
				})));
};
var $author$project$NethysSearch$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var debounce = msg.a;
				return _Utils_eq(model.Q, debounce) ? _Utils_Tuple2(
					model,
					$author$project$NethysSearch$updateUrl(model)) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 1:
				var height = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{az: height}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var result = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							x: A2(
								$elm$core$List$append,
								A2($elm$core$List$filter, $elm_community$result_extra$Result$Extra$isOk, model.x),
								_List_fromArray(
									[result])),
							B: $elm$core$Maybe$Nothing
						}),
					$elm$core$Platform$Cmd$none);
			case 3:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{l: value}),
					$author$project$NethysSearch$updateUrl(
						_Utils_update(
							model,
							{l: value})));
			case 4:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{m: value}),
					$author$project$NethysSearch$updateUrl(
						_Utils_update(
							model,
							{m: value})));
			case 5:
				return $author$project$NethysSearch$searchWithCurrentQuery(
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
			case 6:
				var value = msg.a;
				return _Utils_Tuple2(
					function () {
						var _v1 = A2(
							$elm$json$Json$Decode$decodeValue,
							A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string),
							value);
						_v1$4:
						while (true) {
							if (!_v1.$) {
								switch (_v1.a) {
									case 'theme':
										var _v2 = A2(
											$elm$json$Json$Decode$decodeValue,
											A2($elm$json$Json$Decode$field, 'value', $elm$json$Json$Decode$string),
											value);
										_v2$8:
										while (true) {
											if (!_v2.$) {
												switch (_v2.a) {
													case 'dark':
														return _Utils_update(
															model,
															{j: 0});
													case 'light':
														return _Utils_update(
															model,
															{j: 3});
													case 'book-print':
														return _Utils_update(
															model,
															{j: 4});
													case 'paper':
														return _Utils_update(
															model,
															{j: 4});
													case 'extra-contrast':
														return _Utils_update(
															model,
															{j: 1});
													case 'contrast-dark':
														return _Utils_update(
															model,
															{j: 1});
													case 'lavender':
														return _Utils_update(
															model,
															{j: 2});
													case 'lavander':
														return _Utils_update(
															model,
															{j: 2});
													default:
														break _v2$8;
												}
											} else {
												break _v2$8;
											}
										}
										return model;
									case 'show-additional-info':
										var _v3 = A2(
											$elm$json$Json$Decode$decodeValue,
											A2($elm$json$Json$Decode$field, 'value', $elm$json$Json$Decode$string),
											value);
										_v3$2:
										while (true) {
											if (!_v3.$) {
												switch (_v3.a) {
													case '1':
														return _Utils_update(
															model,
															{L: true});
													case '0':
														return _Utils_update(
															model,
															{L: false});
													default:
														break _v3$2;
												}
											} else {
												break _v3$2;
											}
										}
										return model;
									case 'show-spoilers':
										var _v4 = A2(
											$elm$json$Json$Decode$decodeValue,
											A2($elm$json$Json$Decode$field, 'value', $elm$json$Json$Decode$string),
											value);
										_v4$2:
										while (true) {
											if (!_v4.$) {
												switch (_v4.a) {
													case '1':
														return _Utils_update(
															model,
															{M: true});
													case '0':
														return _Utils_update(
															model,
															{M: false});
													default:
														break _v4$2;
												}
											} else {
												break _v4$2;
											}
										}
										return model;
									case 'show-traits':
										var _v5 = A2(
											$elm$json$Json$Decode$decodeValue,
											A2($elm$json$Json$Decode$field, 'value', $elm$json$Json$Decode$string),
											value);
										_v5$2:
										while (true) {
											if (!_v5.$) {
												switch (_v5.a) {
													case '1':
														return _Utils_update(
															model,
															{N: true});
													case '0':
														return _Utils_update(
															model,
															{N: false});
													default:
														break _v5$2;
												}
											} else {
												break _v5$2;
											}
										}
										return model;
									default:
										break _v1$4;
								}
							} else {
								break _v1$4;
							}
						}
						return model;
					}(),
					$elm$core$Platform$Cmd$none);
			case 7:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{T: true}),
					$elm$core$Platform$Cmd$none);
			case 8:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 9:
				var str = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{Q: model.Q + 1, i: str}),
					A2(
						$elm$core$Task$perform,
						function (_v6) {
							return $author$project$NethysSearch$DebouncePassed(model.Q + 1);
						},
						$elm$core$Process$sleep(250)));
			case 10:
				var queryType = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$NethysSearch$updateUrl(
						_Utils_update(
							model,
							{z: queryType})));
			case 11:
				return _Utils_Tuple2(
					model,
					$author$project$NethysSearch$updateUrl(
						_Utils_update(
							model,
							{d: _List_Nil})));
			case 12:
				return _Utils_Tuple2(
					model,
					$author$project$NethysSearch$updateUrl(
						_Utils_update(
							model,
							{b: $elm$core$Set$empty})));
			case 13:
				return _Utils_Tuple2(
					model,
					$author$project$NethysSearch$updateUrl(
						_Utils_update(
							model,
							{c: $elm$core$Set$empty})));
			case 14:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{V: value}),
					$author$project$NethysSearch$getQueryOptionsHeight);
			case 15:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{W: value}),
					$author$project$NethysSearch$getQueryOptionsHeight);
			case 16:
				return _Utils_Tuple2(
					model,
					A2(
						$elm$core$Task$perform,
						function (_v7) {
							return $author$project$NethysSearch$NoOp;
						},
						A2($elm$browser$Browser$Dom$setViewport, 0, 0)));
			case 17:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{L: value}),
					A2(
						$author$project$NethysSearch$saveToLocalStorage,
						'show-additional-info',
						value ? '1' : '0'));
			case 18:
				var show = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{S: show}),
					$author$project$NethysSearch$getQueryOptionsHeight);
			case 19:
				var show = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ad: show, T: false}),
					show ? A2(
						$elm$core$Task$perform,
						function (_v8) {
							return $author$project$NethysSearch$MenuOpenDelayPassed;
						},
						$elm$core$Process$sleep(250)) : $elm$core$Platform$Cmd$none);
			case 20:
				var show = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{U: show}),
					$author$project$NethysSearch$getQueryOptionsHeight);
			case 21:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{M: value}),
					A2(
						$author$project$NethysSearch$saveToLocalStorage,
						'show-spoilers',
						value ? '1' : '0'));
			case 22:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{N: value}),
					A2(
						$author$project$NethysSearch$saveToLocalStorage,
						'show-traits',
						value ? '1' : '0'));
			case 23:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aA: value}),
					$elm$core$Platform$Cmd$none);
			case 24:
				var field = msg.a;
				var dir = msg.b;
				return _Utils_Tuple2(
					model,
					$author$project$NethysSearch$updateUrl(
						_Utils_update(
							model,
							{
								d: function (list) {
									return A2(
										$elm$core$List$append,
										list,
										_List_fromArray(
											[
												_Utils_Tuple2(field, dir)
											]));
								}(
									A2(
										$elm$core$List$filter,
										A2(
											$elm$core$Basics$composeR,
											$elm$core$Tuple$first,
											$elm$core$Basics$neq(field)),
										model.d))
							})));
			case 25:
				var field = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$NethysSearch$updateUrl(
						_Utils_update(
							model,
							{
								d: A2(
									$elm$core$List$filter,
									A2(
										$elm$core$Basics$composeR,
										$elm$core$Tuple$first,
										$elm$core$Basics$neq(field)),
									model.d)
							})));
			case 26:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aB: value}),
					$elm$core$Platform$Cmd$none);
			case 27:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aC: value}),
					$elm$core$Platform$Cmd$none);
			case 28:
				var theme = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{j: theme}),
					A2(
						$author$project$NethysSearch$saveToLocalStorage,
						'theme',
						function () {
							switch (theme) {
								case 0:
									return 'dark';
								case 3:
									return 'light';
								case 4:
									return 'paper';
								case 1:
									return 'extra-contrast';
								default:
									return 'lavender';
							}
						}()));
			case 29:
				var type_ = msg.a;
				var set = A2($elm$core$Set$insert, type_, model.b);
				return _Utils_Tuple2(
					model,
					$author$project$NethysSearch$updateUrl(
						_Utils_update(
							model,
							{b: set})));
			case 30:
				var type_ = msg.a;
				var set = A2($elm$core$Set$remove, type_, model.b);
				return _Utils_Tuple2(
					model,
					$author$project$NethysSearch$updateUrl(
						_Utils_update(
							model,
							{b: set})));
			case 31:
				var type_ = msg.a;
				var set = A2($elm$core$Set$insert, type_, model.c);
				return _Utils_Tuple2(
					model,
					$author$project$NethysSearch$updateUrl(
						_Utils_update(
							model,
							{c: set})));
			case 32:
				var type_ = msg.a;
				var set = A2($elm$core$Set$remove, type_, model.c);
				return _Utils_Tuple2(
					model,
					$author$project$NethysSearch$updateUrl(
						_Utils_update(
							model,
							{c: set})));
			case 33:
				var url = msg.a;
				return $author$project$NethysSearch$updateTitle(
					$author$project$NethysSearch$searchWithCurrentQuery(
						_Utils_Tuple2(
							A2(
								$author$project$NethysSearch$updateModelFromQueryString,
								$author$project$NethysSearch$parseUrl(url),
								model),
							$elm$core$Platform$Cmd$none)));
			case 34:
				var urlRequest = msg.a;
				if (!urlRequest.$) {
					var url = urlRequest.a;
					return _Utils_Tuple2(
						model,
						$author$project$NethysSearch$navigation_pushUrl(
							$elm$url$Url$toString(url)));
				} else {
					var url = urlRequest.a;
					return _Utils_Tuple2(
						model,
						$author$project$NethysSearch$navigation_loadUrl(url));
				}
			default:
				var width = msg.a;
				var height = msg.b;
				return _Utils_Tuple2(model, $author$project$NethysSearch$getQueryOptionsHeight);
		}
	});
var $author$project$NethysSearch$ShowMenuPressed = function (a) {
	return {$: 19, a: a};
};
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $elm_community$html_extra$Html$Attributes$Extra$empty = $elm$html$Html$Attributes$classList(_List_Nil);
var $elm_community$html_extra$Html$Attributes$Extra$attributeIf = F2(
	function (condition, attr) {
		return condition ? attr : $elm_community$html_extra$Html$Attributes$Extra$empty;
	});
var $lattyware$elm_fontawesome$FontAwesome$Icon$Icon = F5(
	function (prefix, name, width, height, paths) {
		return {bN: height, p: name, cy: paths, cA: prefix, b5: width};
	});
var $lattyware$elm_fontawesome$FontAwesome$Solid$bars = A5(
	$lattyware$elm_fontawesome$FontAwesome$Icon$Icon,
	'fas',
	'bars',
	448,
	512,
	_List_fromArray(
		['M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z']));
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $lattyware$elm_fontawesome$FontAwesome$Styles$css = A3(
	$elm$html$Html$node,
	'style',
	_List_Nil,
	_List_fromArray(
		[
			$elm$html$Html$text('svg:not(:root).svg-inline--fa {  overflow: visible;}.svg-inline--fa {  display: inline-block;  font-size: inherit;  height: 1em;  overflow: visible;  vertical-align: -0.125em;}.svg-inline--fa.fa-lg {  vertical-align: -0.225em;}.svg-inline--fa.fa-w-1 {  width: 0.0625em;}.svg-inline--fa.fa-w-2 {  width: 0.125em;}.svg-inline--fa.fa-w-3 {  width: 0.1875em;}.svg-inline--fa.fa-w-4 {  width: 0.25em;}.svg-inline--fa.fa-w-5 {  width: 0.3125em;}.svg-inline--fa.fa-w-6 {  width: 0.375em;}.svg-inline--fa.fa-w-7 {  width: 0.4375em;}.svg-inline--fa.fa-w-8 {  width: 0.5em;}.svg-inline--fa.fa-w-9 {  width: 0.5625em;}.svg-inline--fa.fa-w-10 {  width: 0.625em;}.svg-inline--fa.fa-w-11 {  width: 0.6875em;}.svg-inline--fa.fa-w-12 {  width: 0.75em;}.svg-inline--fa.fa-w-13 {  width: 0.8125em;}.svg-inline--fa.fa-w-14 {  width: 0.875em;}.svg-inline--fa.fa-w-15 {  width: 0.9375em;}.svg-inline--fa.fa-w-16 {  width: 1em;}.svg-inline--fa.fa-w-17 {  width: 1.0625em;}.svg-inline--fa.fa-w-18 {  width: 1.125em;}.svg-inline--fa.fa-w-19 {  width: 1.1875em;}.svg-inline--fa.fa-w-20 {  width: 1.25em;}.svg-inline--fa.fa-pull-left {  margin-right: 0.3em;  width: auto;}.svg-inline--fa.fa-pull-right {  margin-left: 0.3em;  width: auto;}.svg-inline--fa.fa-border {  height: 1.5em;}.svg-inline--fa.fa-li {  width: 2em;}.svg-inline--fa.fa-fw {  width: 1.25em;}.fa-layers svg.svg-inline--fa {  bottom: 0;  left: 0;  margin: auto;  position: absolute;  right: 0;  top: 0;}.fa-layers {  display: inline-block;  height: 1em;  position: relative;  text-align: center;  vertical-align: -0.125em;  width: 1em;}.fa-layers svg.svg-inline--fa {  -webkit-transform-origin: center center;          transform-origin: center center;}.fa-layers-counter, .fa-layers-text {  display: inline-block;  position: absolute;  text-align: center;}.fa-layers-text {  left: 50%;  top: 50%;  -webkit-transform: translate(-50%, -50%);          transform: translate(-50%, -50%);  -webkit-transform-origin: center center;          transform-origin: center center;}.fa-layers-counter {  background-color: #ff253a;  border-radius: 1em;  -webkit-box-sizing: border-box;          box-sizing: border-box;  color: #fff;  height: 1.5em;  line-height: 1;  max-width: 5em;  min-width: 1.5em;  overflow: hidden;  padding: 0.25em;  right: 0;  text-overflow: ellipsis;  top: 0;  -webkit-transform: scale(0.25);          transform: scale(0.25);  -webkit-transform-origin: top right;          transform-origin: top right;}.fa-layers-bottom-right {  bottom: 0;  right: 0;  top: auto;  -webkit-transform: scale(0.25);          transform: scale(0.25);  -webkit-transform-origin: bottom right;          transform-origin: bottom right;}.fa-layers-bottom-left {  bottom: 0;  left: 0;  right: auto;  top: auto;  -webkit-transform: scale(0.25);          transform: scale(0.25);  -webkit-transform-origin: bottom left;          transform-origin: bottom left;}.fa-layers-top-right {  right: 0;  top: 0;  -webkit-transform: scale(0.25);          transform: scale(0.25);  -webkit-transform-origin: top right;          transform-origin: top right;}.fa-layers-top-left {  left: 0;  right: auto;  top: 0;  -webkit-transform: scale(0.25);          transform: scale(0.25);  -webkit-transform-origin: top left;          transform-origin: top left;}.fa-lg {  font-size: 1.3333333333em;  line-height: 0.75em;  vertical-align: -0.0667em;}.fa-xs {  font-size: 0.75em;}.fa-sm {  font-size: 0.875em;}.fa-1x {  font-size: 1em;}.fa-2x {  font-size: 2em;}.fa-3x {  font-size: 3em;}.fa-4x {  font-size: 4em;}.fa-5x {  font-size: 5em;}.fa-6x {  font-size: 6em;}.fa-7x {  font-size: 7em;}.fa-8x {  font-size: 8em;}.fa-9x {  font-size: 9em;}.fa-10x {  font-size: 10em;}.fa-fw {  text-align: center;  width: 1.25em;}.fa-ul {  list-style-type: none;  margin-left: 2.5em;  padding-left: 0;}.fa-ul > li {  position: relative;}.fa-li {  left: -2em;  position: absolute;  text-align: center;  width: 2em;  line-height: inherit;}.fa-border {  border: solid 0.08em #eee;  border-radius: 0.1em;  padding: 0.2em 0.25em 0.15em;}.fa-pull-left {  float: left;}.fa-pull-right {  float: right;}.fa.fa-pull-left,.fas.fa-pull-left,.far.fa-pull-left,.fal.fa-pull-left,.fab.fa-pull-left {  margin-right: 0.3em;}.fa.fa-pull-right,.fas.fa-pull-right,.far.fa-pull-right,.fal.fa-pull-right,.fab.fa-pull-right {  margin-left: 0.3em;}.fa-spin {  -webkit-animation: fa-spin 2s infinite linear;          animation: fa-spin 2s infinite linear;}.fa-pulse {  -webkit-animation: fa-spin 1s infinite steps(8);          animation: fa-spin 1s infinite steps(8);}@-webkit-keyframes fa-spin {  0% {    -webkit-transform: rotate(0deg);            transform: rotate(0deg);  }  100% {    -webkit-transform: rotate(360deg);            transform: rotate(360deg);  }}@keyframes fa-spin {  0% {    -webkit-transform: rotate(0deg);            transform: rotate(0deg);  }  100% {    -webkit-transform: rotate(360deg);            transform: rotate(360deg);  }}.fa-rotate-90 {  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";  -webkit-transform: rotate(90deg);          transform: rotate(90deg);}.fa-rotate-180 {  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";  -webkit-transform: rotate(180deg);          transform: rotate(180deg);}.fa-rotate-270 {  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";  -webkit-transform: rotate(270deg);          transform: rotate(270deg);}.fa-flip-horizontal {  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";  -webkit-transform: scale(-1, 1);          transform: scale(-1, 1);}.fa-flip-vertical {  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";  -webkit-transform: scale(1, -1);          transform: scale(1, -1);}.fa-flip-both, .fa-flip-horizontal.fa-flip-vertical {  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";  -webkit-transform: scale(-1, -1);          transform: scale(-1, -1);}:root .fa-rotate-90,:root .fa-rotate-180,:root .fa-rotate-270,:root .fa-flip-horizontal,:root .fa-flip-vertical,:root .fa-flip-both {  -webkit-filter: none;          filter: none;}.fa-stack {  display: inline-block;  height: 2em;  position: relative;  width: 2.5em;}.fa-stack-1x,.fa-stack-2x {  bottom: 0;  left: 0;  margin: auto;  position: absolute;  right: 0;  top: 0;}.svg-inline--fa.fa-stack-1x {  height: 1em;  width: 1.25em;}.svg-inline--fa.fa-stack-2x {  height: 2em;  width: 2.5em;}.fa-inverse {  color: #fff;}.sr-only {  border: 0;  clip: rect(0, 0, 0, 0);  height: 1px;  margin: -1px;  overflow: hidden;  padding: 0;  position: absolute;  width: 1px;}.sr-only-focusable:active, .sr-only-focusable:focus {  clip: auto;  height: auto;  margin: 0;  overflow: visible;  position: static;  width: auto;}.svg-inline--fa .fa-primary {  fill: var(--fa-primary-color, currentColor);  opacity: 1;  opacity: var(--fa-primary-opacity, 1);}.svg-inline--fa .fa-secondary {  fill: var(--fa-secondary-color, currentColor);  opacity: 0.4;  opacity: var(--fa-secondary-opacity, 0.4);}.svg-inline--fa.fa-swap-opacity .fa-primary {  opacity: 0.4;  opacity: var(--fa-secondary-opacity, 0.4);}.svg-inline--fa.fa-swap-opacity .fa-secondary {  opacity: 1;  opacity: var(--fa-primary-opacity, 1);}.svg-inline--fa mask .fa-primary,.svg-inline--fa mask .fa-secondary {  fill: black;}.fad.fa-inverse {  color: #fff;}')
		]));
var $author$project$NethysSearch$css = '\n    @font-face {\n        font-family: "Pathfinder-Icons";\n        src: url("Pathfinder-Icons.ttf");\n        font-display: swap;\n    }\n\n    body {\n        margin: 0px;\n    }\n\n    a {\n        color: inherit;\n    }\n\n    a:hover, button:hover {\n        text-decoration: underline;\n    }\n\n    button {\n        border-width: 1px;\n        border-style: solid;\n        border-radius: 4px;\n        background-color: transparent;\n        color: var(--color-text);\n        font-size: var(--font-normal);\n    }\n\n    button.active {\n        background-color: var(--color-text);\n        color: var(--color-bg);\n    }\n\n    button.excluded {\n        color: var(--color-inactive-text);\n    }\n\n    h1 {\n        font-size: 48px;\n        font-weight: normal;\n        margin: 0;\n    }\n\n    h2 {\n        font-size: var(--font-very-large);\n        margin: 0;\n    }\n\n    h3 {\n        font-size: var(--font-large);\n        margin: 0;\n    }\n\n    input[type=text] {\n        background-color: transparent;\n        border-width: 0;\n        color: var(--color-text);\n        padding: 4px;\n        flex-grow: 1;\n    }\n\n    input:focus-visible {\n        border-width: 0;\n        border-style: none;\n        border-image: none;\n        outline: 0;\n    }\n\n    select {\n        font-size: var(--font-normal);\n    }\n\n    .align-baseline {\n        align-items: baseline;\n    }\n\n    .align-center {\n        align-items: center;\n    }\n\n    .align-stretch {\n        align-items: stretch;\n    }\n\n    .body-container {\n        background-color: var(--color-bg);\n        color: var(--color-text);\n        font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;\n        font-size: var(--font-normal);\n        line-height: normal;\n        min-height: 100%;\n        min-width: 400px;\n        position: relative;\n        --font-normal: 16px;\n        --font-large: 20px;\n        --font-very-large: 24px;\n        --gap-tiny: 4px;\n        --gap-small: 8px;\n        --gap-medium: 12px;\n        --gap-large: 20px;\n    }\n\n    .bold {\n        font-weight: 700;\n    }\n\n    .column {\n        display: flex;\n        flex-direction: column;\n    }\n\n    .content-container {\n        box-sizing: border-box;\n        max-width: 1000px;\n        padding: 8px;\n        width: 100%;\n    }\n\n    .row {\n        display: flex;\n        flex-direction: row;\n        flex-wrap: wrap;\n    }\n\n    .column:empty, .row:empty {\n        display: none;\n    }\n\n    .filter-type {\n        border-radius: 4px;\n        border-width: 0;\n        background-color: var(--color-element-bg);\n        color: var(--color-element-text);\n        font-size: 16px;\n        font-variant: small-caps;\n        font-weight: 700;\n        padding: 4px 9px;\n    }\n\n    .filter-type.excluded {\n        background-color: var(--color-element-inactive-bg);\n        color: var(--color-element-inactive-text);\n    }\n\n    .gap-large {\n        gap: var(--gap-large);\n    }\n\n    .gap-medium {\n        gap: var(--gap-medium);\n    }\n\n    .gap-medium.row, .gap-large.row {\n        row-gap: var(--gap-tiny);\n    }\n\n    .gap-small {\n        gap: var(--gap-small);\n    }\n\n    .gap-tiny {\n        gap: var(--gap-tiny);\n    }\n\n    .input-container {\n        background-color: var(--color-bg);\n        border-style: solid;\n        border-radius: 4px;\n        border-width: 2px;\n        border-color: #808080;\n    }\n\n    .input-container:focus-within {\n        border-color: var(--color-text);\n    }\n\n    .icon-font {\n        color: var(--color-icon);\n        font-family: "Pathfinder-Icons";\n        font-variant-caps: normal;\n        font-weight: normal;\n    }\n\n    .input-button {\n        background-color: transparent;\n        border-width: 0;\n        color: var(--color-text);\n    }\n\n    .menu {\n        align-self: flex-start;\n        background-color: var(--color-bg);\n        border-width: 0px 1px 1px 0px;\n        border-style: solid;\n        max-width: 400px;\n        padding: 8px;\n        position: absolute;\n        transition: transform ease-in-out 0.2s;\n        width: 85%;\n        z-index: 2;\n    }\n\n    .menu-close-button {\n        align-self: flex-end;\n        border: 0;\n        font-size: 32px;\n        margin-top: -8px;\n        padding: 8px;\n    }\n\n    .menu-open-button {\n        border: 0;\n        font-size: 32px;\n        left: 0;\n        padding: 8px;\n        position: absolute;\n    }\n\n    .menu-overlay {\n        background-color: #44444488;\n        height: 100%;\n        position: absolute;\n        transition: background-color ease-in-out 0.25s;\n        width: 100%;\n        z-index: 1;\n    }\n\n    .menu-overlay-hidden {\n        background-color: #44444400;\n        pointer-events: none;\n    }\n\n    .monospace {\n        background-color: var(--color-bg-secondary);\n        font-family: monospace;\n        font-size: var(--font-normal);\n    }\n\n    .nowrap {\n        flex-wrap: nowrap;\n    }\n\n    .option-container {\n        border-style: solid;\n        border-width: 1px;\n        background-color: var(--color-container-bg);\n        gap: var(--gap-small);\n        padding: 8px;\n    }\n\n    .query-input {\n        font-size: var(--font-very-large);\n    }\n\n    .query-options-container {\n        transition: height ease-in-out 0.2s;\n        overflow: hidden;\n    }\n\n    .query-options-dummy {\n        opacity: 0;\n        pointer-events: none;\n        position: absolute;\n        visibility: hidden;\n    }\n\n    .scrollbox {\n        background-color: var(--color-bg-secondary);\n        border-color: #767676;\n        border-radius: 4px;\n        border-style: solid;\n        border-width: 1px;\n        max-height: 150px;\n        overflow-y: auto;\n        padding: 4px;\n    }\n\n    .subtitle {\n        border-radius: 4px;\n        background-color: var(--color-subelement-bg);\n        color: var(--color-subelement-text);\n        font-variant: small-caps;\n        line-height: 1rem;\n        padding: 4px 9px;\n    }\n\n    .subtitle:empty {\n        display: none;\n    }\n\n    .title {\n        border-radius: 4px;\n        background-color: var(--color-element-bg);\n        border-color: var(--color-container-border);\n        color: var(--color-element-text);\n        display: flex;\n        flex-direction: row;\n        font-size: var(--font-very-large);\n        font-variant: small-caps;\n        font-weight: 700;\n        gap: var(--gap-small);\n        justify-content: space-between;\n        padding: 4px 9px;\n    }\n\n    .title .icon-font {\n        color: var(--color-element-icon);\n    }\n\n    .title a {\n        text-decoration: none;\n    }\n\n    .title a:hover {\n        text-decoration: underline;\n    }\n\n    .title-type {\n        text-align: right;\n    }\n\n    .trait {\n        background-color: var(--color-element-bg);\n        border-color: var(--color-element-border);\n        border-style: double;\n        border-width: 2px;\n        color: #eeeeee;\n        padding: 3px 5px;\n        font-size: 16px;\n        font-variant: small-caps;\n        font-weight: 700;\n    }\n\n    .trait.excluded {\n        background-color: var(--color-element-inactive-bg);\n        border-color: var(--color-element-inactive-border);\n        color: var(--color-inactive-text);\n    }\n\n    .trait-alignment {\n        background-color: #4287f5;\n    }\n\n    .trait-rare {\n        background-color: #0c1466;\n    }\n\n    .trait-size {\n        background-color: #478c42;\n    }\n\n    .trait-uncommon {\n        background-color: #c45500;\n    }\n\n    .trait-unique {\n        background-color: #800080;\n    }\n\n    .loader {\n        width: 48px;\n        height: 48px;\n        border: 5px solid #FFF;\n        border-bottom-color: transparent;\n        border-radius: 50%;\n        display: inline-block;\n        box-sizing: border-box;\n        align-self: center;\n        animation: rotation 1s linear infinite;\n    }\n\n    @keyframes rotation {\n        0% {\n            transform: rotate(0deg);\n        }\n        100% {\n            transform: rotate(360deg);\n        }\n    }\n    ';
var $author$project$NethysSearch$cssDark = '\n    .body-container {\n        --color-bg: #111111;\n        --color-bg-secondary: #282828;\n        --color-container-bg: #333333;\n        --color-container-border: #eeeeee;\n        --color-element-bg: #522e2c;\n        --color-element-border: #d8c483;\n        --color-element-icon: #cccccc;\n        --color-element-inactive-bg: #291716;\n        --color-element-inactive-border: #6c6242;\n        --color-element-inactive-text: #656148;\n        --color-element-text: #cbc18f;\n        --color-subelement-bg: #806e45;\n        --color-subelement-text: #111111;\n        --color-icon: #cccccc;\n        --color-inactive-text: #999999;\n        --color-text: #eeeeee;\n    }\n    ';
var $author$project$NethysSearch$cssExtraContrast = '\n    .body-container {\n        --color-bg: #111111;\n        --color-bg-secondary: #282828;\n        --color-container-bg: #333333;\n        --color-container-border: #eeeeee;\n        --color-element-bg: #5d0000;\n        --color-element-border: #d8c483;\n        --color-element-icon: #cccccc;\n        --color-element-inactive-bg: #291716;\n        --color-element-inactive-border: #6c6242;\n        --color-element-inactive-text: #656148;\n        --color-element-text: #cbc18f;\n        --color-subelement-bg: #769477;\n        --color-subelement-text: #111111;\n        --color-icon: #cccccc;\n        --color-inactive-text: #999999;\n        --color-text: #eeeeee;\n    }\n    ';
var $author$project$NethysSearch$cssLavender = '\n    .body-container {\n        --color-bg: #ffffff;\n        --color-bg-secondary: #cccccc;\n        --color-container-bg: #dddddd;\n        --color-container-border: #111111;\n        --color-element-bg: #493a88;\n        --color-element-border: #d8c483;\n        --color-element-icon: #cccccc;\n        --color-element-inactive-bg: #291716;\n        --color-element-inactive-border: #6c6242;\n        --color-element-inactive-text: #656148;\n        --color-element-text: #cbc18f;\n        --color-subelement-bg: #f0e6ff;\n        --color-subelement-text: #111111;\n        --color-icon: #000000;\n        --color-inactive-text: #999999;\n        --color-text: #000000;\n    }\n    ';
var $author$project$NethysSearch$cssLight = '\n    .body-container {\n        --color-bg: #eeeeee;\n        --color-bg-secondary: #cccccc;\n        --color-container-bg: #dddddd;\n        --color-container-border: #111111;\n        --color-element-bg: #6f413e;\n        --color-element-border: #d8c483;\n        --color-element-icon: #cccccc;\n        --color-element-inactive-bg: #462b29;\n        --color-element-inactive-border: #6c6242;\n        --color-element-inactive-text: #87805f;\n        --color-element-text: #cbc18f;\n        --color-subelement-bg: #cbc18f;\n        --color-subelement-text: #111111;\n        --color-icon: #111111;\n        --color-inactive-text: #999999;\n        --color-text: #111111;\n    }\n    ';
var $author$project$NethysSearch$cssPaper = '\n    .body-container {\n        --color-bg: #f1ece5;\n        --color-bg-secondary: #cccccc;\n        --color-container-bg: #dddddd;\n        --color-container-border: #111111;\n        --color-element-bg: #5d0000;\n        --color-element-border: #d8c483;\n        --color-element-icon: #111111;\n        --color-element-inactive-bg: #3e0000;\n        --color-element-inactive-border: #48412c;\n        --color-element-inactive-text: #87805f;\n        --color-element-text: #cbc18f;\n        --color-subelement-bg: #dbd0bc;\n        --color-subelement-text: #111111;\n        --color-icon: #111111;\n        --color-inactive-text: #999999;\n        --color-text: #111111;\n    }\n    ';
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$main_ = _VirtualDom_node('main');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onMouseOver = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseover',
		$elm$json$Json$Decode$succeed(msg));
};
var $lattyware$elm_fontawesome$FontAwesome$Icon$Presentation = $elm$core$Basics$identity;
var $lattyware$elm_fontawesome$FontAwesome$Icon$present = function (icon) {
	return {al: _List_Nil, bO: icon, av: $elm$core$Maybe$Nothing, ae: $elm$core$Maybe$Nothing, bk: 'img', cL: $elm$core$Maybe$Nothing, aG: _List_Nil};
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$add = F2(
	function (transform, combined) {
		switch (transform.$) {
			case 0:
				var direction = transform.a;
				var amount = function () {
					if (!direction.$) {
						var by = direction.a;
						return by;
					} else {
						var by = direction.a;
						return -by;
					}
				}();
				return _Utils_update(
					combined,
					{b1: combined.b1 + amount});
			case 1:
				var direction = transform.a;
				var _v2 = function () {
					switch (direction.$) {
						case 0:
							var by = direction.a;
							return _Utils_Tuple2(0, -by);
						case 1:
							var by = direction.a;
							return _Utils_Tuple2(0, by);
						case 2:
							var by = direction.a;
							return _Utils_Tuple2(-by, 0);
						default:
							var by = direction.a;
							return _Utils_Tuple2(by, 0);
					}
				}();
				var x = _v2.a;
				var y = _v2.b;
				return _Utils_update(
					combined,
					{b6: combined.b6 + x, b7: combined.b7 + y});
			case 2:
				var rotation = transform.a;
				return _Utils_update(
					combined,
					{cE: combined.cE + rotation});
			default:
				if (!transform.a) {
					var _v4 = transform.a;
					return _Utils_update(
						combined,
						{ci: true});
				} else {
					var _v5 = transform.a;
					return _Utils_update(
						combined,
						{cj: true});
				}
		}
	});
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize = 16;
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaninglessTransform = {ci: false, cj: false, cE: 0, b1: $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize, b6: 0, b7: 0};
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$combine = function (transforms) {
	return A3($elm$core$List$foldl, $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$add, $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaninglessTransform, transforms);
};
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaningfulTransform = function (transforms) {
	var combined = $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$combine(transforms);
	return _Utils_eq(combined, $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaninglessTransform) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(combined);
};
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$title = $elm$svg$Svg$trustedNode('title');
var $lattyware$elm_fontawesome$FontAwesome$Icon$titledContents = F3(
	function (titleId, contents, title) {
		return A2(
			$elm$core$List$cons,
			A2(
				$elm$svg$Svg$title,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$id(titleId)
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text(title)
					])),
			contents);
	});
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$transformForSvg = F3(
	function (containerWidth, iconWidth, transform) {
		var path = 'translate(' + ($elm$core$String$fromFloat((iconWidth / 2) * (-1)) + ' -256)');
		var outer = 'translate(' + ($elm$core$String$fromFloat(containerWidth / 2) + ' 256)');
		var innerTranslate = 'translate(' + ($elm$core$String$fromFloat(transform.b6 * 32) + (',' + ($elm$core$String$fromFloat(transform.b7 * 32) + ') ')));
		var innerRotate = 'rotate(' + ($elm$core$String$fromFloat(transform.cE) + ' 0 0)');
		var flipY = transform.cj ? (-1) : 1;
		var scaleY = (transform.b1 / $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize) * flipY;
		var flipX = transform.ci ? (-1) : 1;
		var scaleX = (transform.b1 / $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize) * flipX;
		var innerScale = 'scale(' + ($elm$core$String$fromFloat(scaleX) + (', ' + ($elm$core$String$fromFloat(scaleY) + ') ')));
		return {
			bP: $elm$svg$Svg$Attributes$transform(
				_Utils_ap(
					innerTranslate,
					_Utils_ap(innerScale, innerRotate))),
			ae: $elm$svg$Svg$Attributes$transform(outer),
			bT: $elm$svg$Svg$Attributes$transform(path)
		};
	});
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $lattyware$elm_fontawesome$FontAwesome$Icon$allSpace = _List_fromArray(
	[
		$elm$svg$Svg$Attributes$x('0'),
		$elm$svg$Svg$Attributes$y('0'),
		$elm$svg$Svg$Attributes$width('100%'),
		$elm$svg$Svg$Attributes$height('100%')
	]);
var $elm$svg$Svg$clipPath = $elm$svg$Svg$trustedNode('clipPath');
var $elm$svg$Svg$Attributes$clipPath = _VirtualDom_attribute('clip-path');
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $lattyware$elm_fontawesome$FontAwesome$Svg$Internal$corePath = F2(
	function (attrs, d) {
		return A2(
			$elm$svg$Svg$path,
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$fill('currentColor'),
				A2(
					$elm$core$List$cons,
					$elm$svg$Svg$Attributes$d(d),
					attrs)),
			_List_Nil);
	});
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $lattyware$elm_fontawesome$FontAwesome$Svg$Internal$corePaths = F2(
	function (attrs, icon) {
		var _v0 = icon.cy;
		if (!_v0.b) {
			return A2($lattyware$elm_fontawesome$FontAwesome$Svg$Internal$corePath, attrs, '');
		} else {
			if (!_v0.b.b) {
				var only = _v0.a;
				return A2($lattyware$elm_fontawesome$FontAwesome$Svg$Internal$corePath, attrs, only);
			} else {
				var secondary = _v0.a;
				var _v1 = _v0.b;
				var primary = _v1.a;
				return A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('fa-group')
						]),
					_List_fromArray(
						[
							A2(
							$lattyware$elm_fontawesome$FontAwesome$Svg$Internal$corePath,
							A2(
								$elm$core$List$cons,
								$elm$svg$Svg$Attributes$class('fa-secondary'),
								attrs),
							secondary),
							A2(
							$lattyware$elm_fontawesome$FontAwesome$Svg$Internal$corePath,
							A2(
								$elm$core$List$cons,
								$elm$svg$Svg$Attributes$class('fa-primary'),
								attrs),
							primary)
						]));
			}
		}
	});
var $elm$svg$Svg$defs = $elm$svg$Svg$trustedNode('defs');
var $elm$svg$Svg$mask = $elm$svg$Svg$trustedNode('mask');
var $elm$svg$Svg$Attributes$mask = _VirtualDom_attribute('mask');
var $elm$svg$Svg$Attributes$maskContentUnits = _VirtualDom_attribute('maskContentUnits');
var $elm$svg$Svg$Attributes$maskUnits = _VirtualDom_attribute('maskUnits');
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $lattyware$elm_fontawesome$FontAwesome$Icon$viewMaskedWithTransform = F4(
	function (id, transforms, inner, outer) {
		var maskInnerGroup = A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[transforms.bP]),
			_List_fromArray(
				[
					A2(
					$lattyware$elm_fontawesome$FontAwesome$Svg$Internal$corePaths,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fill('black'),
							transforms.bT
						]),
					inner)
				]));
		var maskId = 'mask-' + (inner.p + ('-' + id));
		var maskTag = A2(
			$elm$svg$Svg$mask,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$id(maskId),
						$elm$svg$Svg$Attributes$maskUnits('userSpaceOnUse'),
						$elm$svg$Svg$Attributes$maskContentUnits('userSpaceOnUse')
					]),
				$lattyware$elm_fontawesome$FontAwesome$Icon$allSpace),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$rect,
					A2(
						$elm$core$List$cons,
						$elm$svg$Svg$Attributes$fill('white'),
						$lattyware$elm_fontawesome$FontAwesome$Icon$allSpace),
					_List_Nil),
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[transforms.ae]),
					_List_fromArray(
						[maskInnerGroup]))
				]));
		var clipId = 'clip-' + (outer.p + ('-' + id));
		var defs = A2(
			$elm$svg$Svg$defs,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$clipPath,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$id(clipId)
						]),
					_List_fromArray(
						[
							A2($lattyware$elm_fontawesome$FontAwesome$Svg$Internal$corePaths, _List_Nil, outer)
						])),
					maskTag
				]));
		return _List_fromArray(
			[
				defs,
				A2(
				$elm$svg$Svg$rect,
				$elm$core$List$concat(
					_List_fromArray(
						[
							_List_fromArray(
							[
								$elm$svg$Svg$Attributes$fill('currentColor'),
								$elm$svg$Svg$Attributes$clipPath('url(#' + (clipId + ')')),
								$elm$svg$Svg$Attributes$mask('url(#' + (maskId + ')'))
							]),
							$lattyware$elm_fontawesome$FontAwesome$Icon$allSpace
						])),
				_List_Nil)
			]);
	});
var $lattyware$elm_fontawesome$FontAwesome$Icon$viewWithTransform = F2(
	function (transforms, icon) {
		if (!transforms.$) {
			var ts = transforms.a;
			return A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[ts.ae]),
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$g,
						_List_fromArray(
							[ts.bP]),
						_List_fromArray(
							[
								A2(
								$lattyware$elm_fontawesome$FontAwesome$Svg$Internal$corePaths,
								_List_fromArray(
									[ts.bT]),
								icon)
							]))
					]));
		} else {
			return A2($lattyware$elm_fontawesome$FontAwesome$Svg$Internal$corePaths, _List_Nil, icon);
		}
	});
var $lattyware$elm_fontawesome$FontAwesome$Icon$internalView = function (_v0) {
	var icon = _v0.bO;
	var attributes = _v0.al;
	var transforms = _v0.aG;
	var role = _v0.bk;
	var id = _v0.av;
	var title = _v0.cL;
	var outer = _v0.ae;
	var alwaysId = A2($elm$core$Maybe$withDefault, icon.p, id);
	var titleId = alwaysId + '-title';
	var semantics = A2(
		$elm$core$Maybe$withDefault,
		A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true'),
		A2(
			$elm$core$Maybe$map,
			$elm$core$Basics$always(
				A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', titleId)),
			title));
	var _v1 = A2(
		$elm$core$Maybe$withDefault,
		_Utils_Tuple2(icon.b5, icon.bN),
		A2(
			$elm$core$Maybe$map,
			function (o) {
				return _Utils_Tuple2(o.b5, o.bN);
			},
			outer));
	var width = _v1.a;
	var height = _v1.b;
	var classes = _List_fromArray(
		[
			'svg-inline--fa',
			'fa-' + icon.p,
			'fa-w-' + $elm$core$String$fromInt(
			$elm$core$Basics$ceiling((width / height) * 16))
		]);
	var svgTransform = A2(
		$elm$core$Maybe$map,
		A2($lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$transformForSvg, width, icon.b5),
		$lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaningfulTransform(transforms));
	var contents = function () {
		var resolvedSvgTransform = A2(
			$elm$core$Maybe$withDefault,
			A3($lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$transformForSvg, width, icon.b5, $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaninglessTransform),
			svgTransform);
		return A2(
			$elm$core$Maybe$withDefault,
			_List_fromArray(
				[
					A2($lattyware$elm_fontawesome$FontAwesome$Icon$viewWithTransform, svgTransform, icon)
				]),
			A2(
				$elm$core$Maybe$map,
				A3($lattyware$elm_fontawesome$FontAwesome$Icon$viewMaskedWithTransform, alwaysId, resolvedSvgTransform, icon),
				outer));
	}();
	var potentiallyTitledContents = A2(
		$elm$core$Maybe$withDefault,
		contents,
		A2(
			$elm$core$Maybe$map,
			A2($lattyware$elm_fontawesome$FontAwesome$Icon$titledContents, titleId, contents),
			title));
	return A2(
		$elm$svg$Svg$svg,
		$elm$core$List$concat(
			_List_fromArray(
				[
					_List_fromArray(
					[
						A2($elm$html$Html$Attributes$attribute, 'role', role),
						A2($elm$html$Html$Attributes$attribute, 'xmlns', 'http://www.w3.org/2000/svg'),
						$elm$svg$Svg$Attributes$viewBox(
						'0 0 ' + ($elm$core$String$fromInt(width) + (' ' + $elm$core$String$fromInt(height)))),
						semantics
					]),
					A2($elm$core$List$map, $elm$svg$Svg$Attributes$class, classes),
					attributes
				])),
		potentiallyTitledContents);
};
var $lattyware$elm_fontawesome$FontAwesome$Icon$view = function (presentation) {
	return $lattyware$elm_fontawesome$FontAwesome$Icon$internalView(presentation);
};
var $lattyware$elm_fontawesome$FontAwesome$Icon$viewIcon = A2($elm$core$Basics$composeR, $lattyware$elm_fontawesome$FontAwesome$Icon$present, $lattyware$elm_fontawesome$FontAwesome$Icon$view);
var $author$project$NethysSearch$ShowAdditionalInfoChanged = function (a) {
	return {$: 17, a: a};
};
var $author$project$NethysSearch$ShowSpoilersChanged = function (a) {
	return {$: 21, a: a};
};
var $author$project$NethysSearch$ShowTraitsChanged = function (a) {
	return {$: 22, a: a};
};
var $author$project$NethysSearch$ThemeSelected = function (a) {
	return {$: 28, a: a};
};
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$section = _VirtualDom_node('section');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $lattyware$elm_fontawesome$FontAwesome$Solid$times = A5(
	$lattyware$elm_fontawesome$FontAwesome$Icon$Icon,
	'fas',
	'times',
	352,
	512,
	_List_fromArray(
		['M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z']));
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Events$targetChecked = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	$elm$json$Json$Decode$bool);
var $elm$html$Html$Events$onCheck = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetChecked));
};
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$NethysSearch$viewCheckbox = function (_v0) {
	var checked = _v0.k;
	var onCheck = _v0.aw;
	var text = _v0.n;
	return A2(
		$elm$html$Html$label,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('row'),
				$elm$html$Html$Attributes$class('align-baseline')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('checkbox'),
						$elm$html$Html$Attributes$checked(checked),
						$elm$html$Html$Events$onCheck(onCheck)
					]),
				_List_Nil),
				$elm$html$Html$text(text)
			]));
};
var $author$project$NethysSearch$viewFaq = F2(
	function (question, answer) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('column'),
					$elm$html$Html$Attributes$class('gap-tiny')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h3,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('subtitle')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(question)
						])),
					A2($elm$html$Html$div, _List_Nil, answer)
				]));
	});
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $author$project$NethysSearch$viewRadioButton = function (_v0) {
	var checked = _v0.k;
	var name = _v0.p;
	var onInput = _v0.t;
	var text = _v0.n;
	return A2(
		$elm$html$Html$label,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('row'),
				$elm$html$Html$Attributes$class('align-baseline')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('radio'),
						$elm$html$Html$Attributes$checked(checked),
						$elm$html$Html$Attributes$name(name),
						$elm$html$Html$Events$onClick(onInput)
					]),
				_List_Nil),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(text)
					]))
			]));
};
var $author$project$NethysSearch$viewMenu = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('menu'),
				$elm$html$Html$Attributes$class('column'),
				A2(
				$elm_community$html_extra$Html$Attributes$Extra$attributeIf,
				!model.ad,
				A2($elm$html$Html$Attributes$style, 'transform', 'translate(-100%, 0px)'))
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('menu-close-button'),
						$elm$html$Html$Events$onClick(
						$author$project$NethysSearch$ShowMenuPressed(false)),
						A2(
						$elm_community$html_extra$Html$Attributes$Extra$attributeIf,
						model.T,
						$elm$html$Html$Events$onMouseOver(
							$author$project$NethysSearch$ShowMenuPressed(false)))
					]),
				_List_fromArray(
					[
						$lattyware$elm_fontawesome$FontAwesome$Icon$viewIcon($lattyware$elm_fontawesome$FontAwesome$Solid$times)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('column'),
						$elm$html$Html$Attributes$class('gap-large')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$section,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('column'),
								$elm$html$Html$Attributes$class('gap-medium')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h2,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('title')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Options')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('column'),
										$elm$html$Html$Attributes$class('gap-tiny')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$h3,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('subtitle')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Theme')
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('row'),
												$elm$html$Html$Attributes$class('gap-medium')
											]),
										_List_fromArray(
											[
												$author$project$NethysSearch$viewRadioButton(
												{
													k: !model.j,
													p: 'theme-type',
													t: $author$project$NethysSearch$ThemeSelected(0),
													n: 'Dark'
												}),
												$author$project$NethysSearch$viewRadioButton(
												{
													k: model.j === 3,
													p: 'theme-type',
													t: $author$project$NethysSearch$ThemeSelected(3),
													n: 'Light'
												}),
												$author$project$NethysSearch$viewRadioButton(
												{
													k: model.j === 4,
													p: 'theme-type',
													t: $author$project$NethysSearch$ThemeSelected(4),
													n: 'Paper'
												}),
												$author$project$NethysSearch$viewRadioButton(
												{
													k: model.j === 1,
													p: 'theme-type',
													t: $author$project$NethysSearch$ThemeSelected(1),
													n: 'Extra Contrast'
												}),
												$author$project$NethysSearch$viewRadioButton(
												{
													k: model.j === 2,
													p: 'theme-type',
													t: $author$project$NethysSearch$ThemeSelected(2),
													n: 'Lavender'
												})
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('column'),
										$elm$html$Html$Attributes$class('gap-tiny')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$h3,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('subtitle')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Result display')
											])),
										$author$project$NethysSearch$viewCheckbox(
										{k: model.M, aw: $author$project$NethysSearch$ShowSpoilersChanged, n: 'Show spoiler warning'}),
										$author$project$NethysSearch$viewCheckbox(
										{k: model.N, aw: $author$project$NethysSearch$ShowTraitsChanged, n: 'Show traits'}),
										$author$project$NethysSearch$viewCheckbox(
										{k: model.L, aw: $author$project$NethysSearch$ShowAdditionalInfoChanged, n: 'Show additional info'})
									]))
							])),
						A2(
						$elm$html$Html$section,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('column'),
								$elm$html$Html$Attributes$class('gap-medium')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h2,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('title')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('About / F.A.Q.')
									])),
								A2(
								$author$project$NethysSearch$viewFaq,
								'What is this?',
								_List_fromArray(
									[
										$elm$html$Html$text('A search engine that searches '),
										A2(
										$elm$html$Html$a,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$href('https://2e.aonprd.com/'),
												$elm$html$Html$Attributes$target('_blank')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Archives of Nethys')
											])),
										$elm$html$Html$text(', the System Reference Document for Pathfinder Second Edition.')
									])),
								A2(
								$author$project$NethysSearch$viewFaq,
								'How can I contact you?',
								_List_fromArray(
									[
										$elm$html$Html$text('You can send me an email (nethys-search <at> galdiuz.com), message me on Discord (Galdiuz#7937), or '),
										A2(
										$elm$html$Html$a,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$href('https://github.com/galdiuz/nethys-search/issues'),
												$elm$html$Html$Attributes$target('_blank')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('submit an issue on GitHub')
											])),
										$elm$html$Html$text('.')
									]))
							]))
					]))
			]));
};
var $author$project$NethysSearch$QueryChanged = function (a) {
	return {$: 9, a: a};
};
var $author$project$NethysSearch$QueryTypeSelected = function (a) {
	return {$: 10, a: a};
};
var $author$project$NethysSearch$ShowQueryOptionsPressed = function (a) {
	return {$: 20, a: a};
};
var $author$project$NethysSearch$SortRemoved = function (a) {
	return {$: 25, a: a};
};
var $elm$html$Html$Attributes$autofocus = $elm$html$Html$Attributes$boolProperty('autofocus');
var $lattyware$elm_fontawesome$FontAwesome$Solid$chevronDown = A5(
	$lattyware$elm_fontawesome$FontAwesome$Icon$Icon,
	'fas',
	'chevron-down',
	448,
	512,
	_List_fromArray(
		['M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z']));
var $lattyware$elm_fontawesome$FontAwesome$Solid$chevronUp = A5(
	$lattyware$elm_fontawesome$FontAwesome$Icon$Icon,
	'fas',
	'chevron-up',
	448,
	512,
	_List_fromArray(
		['M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z']));
var $lattyware$elm_fontawesome$FontAwesome$Solid$exclamation = A5(
	$lattyware$elm_fontawesome$FontAwesome$Icon$Icon,
	'fas',
	'exclamation',
	192,
	512,
	_List_fromArray(
		['M176 432c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80zM25.26 25.199l13.6 272C39.499 309.972 50.041 320 62.83 320h66.34c12.789 0 23.331-10.028 23.97-22.801l13.6-272C167.425 11.49 156.496 0 142.77 0H49.23C35.504 0 24.575 11.49 25.26 25.199z']));
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$core$String$any = _String_any;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $author$project$NethysSearch$stringContainsChar = F2(
	function (str, chars) {
		return A2(
			$elm$core$String$any,
			function (_char) {
				return A2(
					$elm$core$String$contains,
					$elm$core$String$fromChar(_char),
					str);
			},
			chars);
	});
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$NethysSearch$TraitFilterRemoved = function (a) {
	return {$: 30, a: a};
};
var $author$project$NethysSearch$TypeFilterRemoved = function (a) {
	return {$: 32, a: a};
};
var $author$project$NethysSearch$viewExcludeFilters = function (model) {
	return (($elm$core$Set$isEmpty(model.b) || model.l) && ($elm$core$Set$isEmpty(model.c) || model.m)) ? $elm$html$Html$text('') : A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('row'),
				$elm$html$Html$Attributes$class('gap-tiny'),
				$elm$html$Html$Attributes$class('align-baseline')
			]),
		$elm$core$List$concat(
			_List_fromArray(
				[
					_List_fromArray(
					[
						$elm$html$Html$text('Exclude:')
					]),
					($elm$core$Set$isEmpty(model.c) || model.m) ? _List_Nil : A2(
					$elm$core$List$map,
					function (type_) {
						return A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('filter-type'),
									$elm$html$Html$Events$onClick(
									$author$project$NethysSearch$TypeFilterRemoved(type_))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(type_)
								]));
					},
					$elm$core$Set$toList(model.c)),
					($elm$core$Set$isEmpty(model.b) || model.l) ? _List_Nil : A2(
					$elm$core$List$map,
					function (trait) {
						return A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('trait'),
									$elm$html$Html$Events$onClick(
									$author$project$NethysSearch$TraitFilterRemoved(trait))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(trait)
								]));
					},
					$elm$core$Set$toList(model.b))
				])));
};
var $author$project$NethysSearch$viewIncludeFilters = function (model) {
	return (($elm$core$Set$isEmpty(model.b) || (!model.l)) && ($elm$core$Set$isEmpty(model.c) || (!model.m))) ? $elm$html$Html$text('') : A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('row'),
				$elm$html$Html$Attributes$class('gap-tiny'),
				$elm$html$Html$Attributes$class('align-baseline')
			]),
		$elm$core$List$concat(
			_List_fromArray(
				[
					_List_fromArray(
					[
						$elm$html$Html$text('Include:')
					]),
					($elm$core$Set$isEmpty(model.c) || (!model.m)) ? _List_Nil : A2(
					$elm$core$List$map,
					function (type_) {
						return A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('filter-type'),
									$elm$html$Html$Events$onClick(
									$author$project$NethysSearch$TypeFilterRemoved(type_))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(type_)
								]));
					},
					$elm$core$Set$toList(model.c)),
					($elm$core$Set$isEmpty(model.b) || (!model.l)) ? _List_Nil : A2(
					$elm$core$List$map,
					function (trait) {
						return A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('trait'),
									$elm$html$Html$Events$onClick(
									$author$project$NethysSearch$TraitFilterRemoved(trait))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(trait)
								]));
					},
					$elm$core$Set$toList(model.b))
				])));
};
var $author$project$NethysSearch$IncludeFilteredTraitsChanged = function (a) {
	return {$: 3, a: a};
};
var $author$project$NethysSearch$RemoveAllTraitFiltersPressed = {$: 12};
var $author$project$NethysSearch$SearchTraitsChanged = function (a) {
	return {$: 14, a: a};
};
var $author$project$NethysSearch$TraitFilterAdded = function (a) {
	return {$: 29, a: a};
};
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm$core$Basics$xor = _Basics_xor;
var $author$project$NethysSearch$viewFilterTraits = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('option-container'),
				$elm$html$Html$Attributes$class('column')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Filter traits')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('align-baseline'),
						$elm$html$Html$Attributes$class('gap-medium')
					]),
				_List_fromArray(
					[
						$author$project$NethysSearch$viewRadioButton(
						{
							k: model.l,
							p: 'filter-traits',
							t: $author$project$NethysSearch$IncludeFilteredTraitsChanged(true),
							n: 'Include selected'
						}),
						$author$project$NethysSearch$viewRadioButton(
						{
							k: !model.l,
							p: 'filter-traits',
							t: $author$project$NethysSearch$IncludeFilteredTraitsChanged(false),
							n: 'Exclude selected'
						}),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$NethysSearch$RemoveAllTraitFiltersPressed)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Reset selection')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('input-container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$placeholder('Search among traits'),
								$elm$html$Html$Attributes$value(model.V),
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Events$onInput($author$project$NethysSearch$SearchTraitsChanged)
							]),
						_List_Nil),
						$elm$core$String$isEmpty(model.V) ? $elm$html$Html$text('') : A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('input-button'),
								$elm$html$Html$Events$onClick(
								$author$project$NethysSearch$SearchTraitsChanged(''))
							]),
						_List_fromArray(
							[
								$lattyware$elm_fontawesome$FontAwesome$Icon$viewIcon($lattyware$elm_fontawesome$FontAwesome$Solid$times)
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('gap-tiny'),
						$elm$html$Html$Attributes$class('scrollbox')
					]),
				A2(
					$elm$core$List$map,
					function (type_) {
						return A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('trait'),
									A2(
									$elm_community$html_extra$Html$Attributes$Extra$attributeIf,
									(model.l !== A2($elm$core$Set$member, type_, model.b)) && (!$elm$core$Set$isEmpty(model.b)),
									$elm$html$Html$Attributes$class('excluded')),
									$elm$html$Html$Events$onClick(
									A2($elm$core$Set$member, type_, model.b) ? $author$project$NethysSearch$TraitFilterRemoved(type_) : $author$project$NethysSearch$TraitFilterAdded(type_))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(type_)
								]));
					},
					A2(
						$elm$core$List$filter,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$String$toLower,
							$elm$core$String$contains(
								$elm$core$String$toLower(model.V))),
						$author$project$Data$traits)))
			]));
};
var $author$project$NethysSearch$IncludeFilteredTypesChanged = function (a) {
	return {$: 4, a: a};
};
var $author$project$NethysSearch$RemoveAllTypeFiltersPressed = {$: 13};
var $author$project$NethysSearch$SearchTypesChanged = function (a) {
	return {$: 15, a: a};
};
var $author$project$NethysSearch$TypeFilterAdded = function (a) {
	return {$: 31, a: a};
};
var $author$project$NethysSearch$viewFilterTypes = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('option-container'),
				$elm$html$Html$Attributes$class('column')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Filter types')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('align-baseline'),
						$elm$html$Html$Attributes$class('gap-medium')
					]),
				_List_fromArray(
					[
						$author$project$NethysSearch$viewRadioButton(
						{
							k: model.m,
							p: 'filter-types',
							t: $author$project$NethysSearch$IncludeFilteredTypesChanged(true),
							n: 'Include selected'
						}),
						$author$project$NethysSearch$viewRadioButton(
						{
							k: !model.m,
							p: 'filter-types',
							t: $author$project$NethysSearch$IncludeFilteredTypesChanged(false),
							n: 'Exclude selected'
						}),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$NethysSearch$RemoveAllTypeFiltersPressed)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Reset selection')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('input-container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$placeholder('Search among types'),
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$value(model.W),
								$elm$html$Html$Events$onInput($author$project$NethysSearch$SearchTypesChanged)
							]),
						_List_Nil),
						$elm$core$String$isEmpty(model.W) ? $elm$html$Html$text('') : A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('input-button'),
								$elm$html$Html$Events$onClick(
								$author$project$NethysSearch$SearchTypesChanged(''))
							]),
						_List_fromArray(
							[
								$lattyware$elm_fontawesome$FontAwesome$Icon$viewIcon($lattyware$elm_fontawesome$FontAwesome$Solid$times)
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('gap-tiny'),
						$elm$html$Html$Attributes$class('scrollbox')
					]),
				A2(
					$elm$core$List$map,
					function (type_) {
						return A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('filter-type'),
									A2(
									$elm_community$html_extra$Html$Attributes$Extra$attributeIf,
									(model.m !== A2($elm$core$Set$member, type_, model.c)) && (!$elm$core$Set$isEmpty(model.c)),
									$elm$html$Html$Attributes$class('excluded')),
									$elm$html$Html$Events$onClick(
									A2($elm$core$Set$member, type_, model.c) ? $author$project$NethysSearch$TypeFilterRemoved(type_) : $author$project$NethysSearch$TypeFilterAdded(type_))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(type_)
								]));
					},
					A2(
						$elm$core$List$filter,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$String$toLower,
							$elm$core$String$contains(
								$elm$core$String$toLower(model.W))),
						$author$project$Data$types)))
			]));
};
var $author$project$NethysSearch$ShowEqsHelpPressed = function (a) {
	return {$: 18, a: a};
};
var $author$project$Data$fields = _List_fromArray(
	[
		_Utils_Tuple2('ability', 'Ability related to a deity or skill'),
		_Utils_Tuple2('ability_type', 'Familiar ability type (Familiar / Master)'),
		_Utils_Tuple2('ac', '[n] Armor class of an armor, creature, or shield'),
		_Utils_Tuple2('actions', 'Actions required to use an action, feat, or creature ability'),
		_Utils_Tuple2('activate', 'Activation requirements of an item'),
		_Utils_Tuple2('advanced_domain_spell', 'Advanced domain spell'),
		_Utils_Tuple2('alignment', 'Alignment'),
		_Utils_Tuple2('ammunition', 'Ammunition type used by a weapon'),
		_Utils_Tuple2('archetype', 'Archetypes associated with a feat'),
		_Utils_Tuple2('area', 'Area of a spell'),
		_Utils_Tuple2('armor_group', 'Armor group'),
		_Utils_Tuple2('aspect', 'Relic gift aspect type'),
		_Utils_Tuple2('bloodline', 'Sorcerer bloodlines associated with a spell'),
		_Utils_Tuple2('bloodline_spell', 'Sorcerer bloodline\'s spells'),
		_Utils_Tuple2('bulk', 'Item bulk (\'L\' is 0.1)'),
		_Utils_Tuple2('cast', 'Actions or time required to cast a spell or ritual'),
		_Utils_Tuple2('cha', '[n] Alias for \'charisma\''),
		_Utils_Tuple2('charisma', '[n] Charisma'),
		_Utils_Tuple2('check_penalty', '[n] Armor check penalty'),
		_Utils_Tuple2('cleric_spell', 'Cleric spells granted by a deity'),
		_Utils_Tuple2('complexity', 'Hazard complexity'),
		_Utils_Tuple2('component', 'Spell casting components (Material / Somatic / Verbal)'),
		_Utils_Tuple2('con', '[n] Alias for \'constitution\''),
		_Utils_Tuple2('constitution', '[n] Constitution'),
		_Utils_Tuple2('cost', 'Cost to use an action or cast a ritual'),
		_Utils_Tuple2('creature_family', 'Creature family'),
		_Utils_Tuple2('damage', 'Weapon damage'),
		_Utils_Tuple2('deed', 'Gunslinger way deeds'),
		_Utils_Tuple2('deity', 'Deities associated with a domain, spell, or weapon'),
		_Utils_Tuple2('dex', '[n] Alias for \'dexterity\''),
		_Utils_Tuple2('dex_cap', '[n] Armor dex cap'),
		_Utils_Tuple2('dexterity', 'Dexterity'),
		_Utils_Tuple2('disable', 'Hazard disable requirements'),
		_Utils_Tuple2('divine_font', 'Deity\'s divine font'),
		_Utils_Tuple2('divinity', 'Plane divinities'),
		_Utils_Tuple2('domain_spell', 'Domain spell'),
		_Utils_Tuple2('domain', 'Domains related to deity or spell'),
		_Utils_Tuple2('duration', 'Duration of spell or poison'),
		_Utils_Tuple2('familiar_ability', 'Abilities granted by specific familiars'),
		_Utils_Tuple2('favored_weapon', 'Deity\'s favored weapon'),
		_Utils_Tuple2('feat', 'Related feat'),
		_Utils_Tuple2('follower_alignment', 'Deity\'s follower alignments'),
		_Utils_Tuple2('fort', '[n] Alias for \'fortitude_save\''),
		_Utils_Tuple2('fortitude', '[n] Alias for \'fortitude_save\''),
		_Utils_Tuple2('fortitude_save', '[n] Fortitude save'),
		_Utils_Tuple2('frequency', 'Frequency of which something can be used'),
		_Utils_Tuple2('granted_spell', 'Spells granted by a sorcerer bloodline or witch patron theme'),
		_Utils_Tuple2('hands', 'Hands required to use item'),
		_Utils_Tuple2('hardness', '[n] Hazard or shield hardness'),
		_Utils_Tuple2('heighten', 'Spell heightens available'),
		_Utils_Tuple2('hex_cantrip', 'Witch patron theme hex cantrip'),
		_Utils_Tuple2('home_plane', 'Summoner eidolon home plane'),
		_Utils_Tuple2('hp', '[n] Hit points'),
		_Utils_Tuple2('immunity', 'Immunities'),
		_Utils_Tuple2('int', '[n] Alias for \'intelligence\''),
		_Utils_Tuple2('intelligence', '[n] Intelligence'),
		_Utils_Tuple2('item', 'Items carried by a creature'),
		_Utils_Tuple2('language', 'Languages spoken'),
		_Utils_Tuple2('lesson_type', 'Witch lesson type'),
		_Utils_Tuple2('level', '[n] Level'),
		_Utils_Tuple2('mystery', 'Oracle mysteries associated with a spell'),
		_Utils_Tuple2('name', 'Name'),
		_Utils_Tuple2('onset', 'Onset of a disease or poison'),
		_Utils_Tuple2('patron_theme', 'Witch patron themes associated with a spell'),
		_Utils_Tuple2('per', '[n] Alias for \'perception\''),
		_Utils_Tuple2('perception', '[n] Perception'),
		_Utils_Tuple2('pfs', 'Pathfinder Society status (Standard / Limited / Restricted)'),
		_Utils_Tuple2('plane_category', 'Plane category'),
		_Utils_Tuple2('prerequisite', 'Prerequisites'),
		_Utils_Tuple2('price', '[n] Item price in copper coins'),
		_Utils_Tuple2('primary_check', 'Primary check of a ritual'),
		_Utils_Tuple2('range', '[n] Range of spell or weapon in feet'),
		_Utils_Tuple2('ref', '[n] Alias for \'reflex_save\''),
		_Utils_Tuple2('reflex', '[n] Alias for \'reflex_save\''),
		_Utils_Tuple2('reflex_save', '[n] Reflex save'),
		_Utils_Tuple2('region', 'Background region'),
		_Utils_Tuple2('reload', '[n] Weapon reload'),
		_Utils_Tuple2('required_abilities', '[n] Number of required familiar abilities for a specific familiar'),
		_Utils_Tuple2('requirement', 'Requirements'),
		_Utils_Tuple2('resistance.<type>', '[n] Resistance to <type>. See list of valid types below. Use resistance.\\* to match any type.'),
		_Utils_Tuple2('resistance_raw', 'Resistances exactly as written'),
		_Utils_Tuple2('saving_throw', 'Saving throw for a disease, poison, or spell (Fortitude / Reflex / Will)'),
		_Utils_Tuple2('secondary_casters', '[n] Secondary casters for a ritual'),
		_Utils_Tuple2('secondary_check', 'Secondary checks for a ritual'),
		_Utils_Tuple2('sense', 'Senses'),
		_Utils_Tuple2('size', 'Size'),
		_Utils_Tuple2('skill', 'Related skills'),
		_Utils_Tuple2('slingers_reload', 'Gunslinger way\'s slinger\'s reload'),
		_Utils_Tuple2('source', 'Source book name'),
		_Utils_Tuple2('source_raw', 'Source book exactly as written incl. page'),
		_Utils_Tuple2('speed', 'Speeds'),
		_Utils_Tuple2('speed_penalty', 'Speed penalty of armor or shield'),
		_Utils_Tuple2('spell_list', 'Spell list of a Sorcerer bloodline or witch patron theme'),
		_Utils_Tuple2('spoilers', 'Adventure path name if there is a spoiler warning on the page'),
		_Utils_Tuple2('stage', 'Stages of a disease or poison'),
		_Utils_Tuple2('stealth', 'Hazard stealth'),
		_Utils_Tuple2('str', '[n] Alias for \'strength\''),
		_Utils_Tuple2('strength', '[n] Creature strength or armor strength requirement'),
		_Utils_Tuple2('strongest_save', 'The strongest save(s) of a creature ( Fortitude / Reflex / Will )'),
		_Utils_Tuple2('target', 'Spell targets'),
		_Utils_Tuple2('text', 'All text on a page'),
		_Utils_Tuple2('tradition', 'Traditions of spell or summoner eidolon'),
		_Utils_Tuple2('trait', 'Traits with values removed, e.g. \'Deadly d6\' is normalized as \'Deadly\''),
		_Utils_Tuple2('trait_raw', 'Traits exactly as written'),
		_Utils_Tuple2('trigger', 'Trigger'),
		_Utils_Tuple2('type', 'Type'),
		_Utils_Tuple2('usage', 'Usage of curse or item'),
		_Utils_Tuple2('weakest_save', 'The weakest save(s) of a creature (Fortitude / Reflex / Will)'),
		_Utils_Tuple2('weakness.<type>', '[n] Weakness to <type>. See list of valid types below. Use weakness.\\* to match any type.'),
		_Utils_Tuple2('weakness_raw', 'Weaknesses exactly as written'),
		_Utils_Tuple2('weapon_category', 'Weapon category (Simple / Martial / Advanced / Ammunition)'),
		_Utils_Tuple2('weapon_group', 'Weapon group'),
		_Utils_Tuple2('will', '[n] Alias for \'will_save\''),
		_Utils_Tuple2('will_save', '[n] Will save'),
		_Utils_Tuple2('wis', '[n] Alias for \'wisdom\''),
		_Utils_Tuple2('wisdom', '[n] Wisdom')
	]);
var $elm$core$List$intersperse = F2(
	function (sep, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var hd = xs.a;
			var tl = xs.b;
			var step = F2(
				function (x, rest) {
					return A2(
						$elm$core$List$cons,
						sep,
						A2($elm$core$List$cons, x, rest));
				});
			var spersed = A3($elm$core$List$foldr, step, _List_Nil, tl);
			return A2($elm$core$List$cons, hd, spersed);
		}
	});
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$NethysSearch$viewQueryType = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('option-container'),
				$elm$html$Html$Attributes$class('column')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Query type')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('align-baseline'),
						$elm$html$Html$Attributes$class('gap-medium')
					]),
				_List_fromArray(
					[
						$author$project$NethysSearch$viewRadioButton(
						{
							k: !model.z,
							p: 'query-type',
							t: $author$project$NethysSearch$QueryTypeSelected(0),
							n: 'Standard'
						}),
						$author$project$NethysSearch$viewRadioButton(
						{
							k: model.z === 1,
							p: 'query-type',
							t: $author$project$NethysSearch$QueryTypeSelected(1),
							n: 'Complex'
						}),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick(
								$author$project$NethysSearch$ShowEqsHelpPressed(!model.S))
							]),
						model.S ? _List_fromArray(
							[
								$elm$html$Html$text('Hide help')
							]) : _List_fromArray(
							[
								$elm$html$Html$text('Show help')
							]))
					])),
				model.S ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('column'),
						$elm$html$Html$Attributes$class('gap-small')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('With the complex query type you can write queries using Elasticsearch Query String syntax. The general idea is that you can search in specific fields by searching '),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('monospace')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('field:value')
									])),
								$elm$html$Html$text('. For full documentation on how the query syntax works see '),
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href('https://www.elastic.co/guide/en/elasticsearch/reference/7.15/query-dsl-query-string-query.html#query-string-syntax'),
										$elm$html$Html$Attributes$target('_blank')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Elasticsearch\'s documentation')
									])),
								$elm$html$Html$text('. See below for a list of available fields. [n] means the field is numeric and supports range queries.')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('scrollbox'),
								$elm$html$Html$Attributes$class('column'),
								$elm$html$Html$Attributes$class('gap-medium')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('column'),
										$elm$html$Html$Attributes$class('gap-tiny')
									]),
								A2(
									$elm$core$List$append,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('row'),
													$elm$html$Html$Attributes$class('gap-medium')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('bold'),
															A2($elm$html$Html$Attributes$style, 'width', '35%'),
															A2($elm$html$Html$Attributes$style, 'max-width', '200px')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Field')
														])),
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('bold'),
															A2($elm$html$Html$Attributes$style, 'max-width', '60%')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Description')
														]))
												]))
										]),
									A2(
										$elm$core$List$map,
										function (_v0) {
											var field = _v0.a;
											var desc = _v0.b;
											return A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('row'),
														$elm$html$Html$Attributes$class('gap-medium')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																A2($elm$html$Html$Attributes$style, 'width', '35%'),
																A2($elm$html$Html$Attributes$style, 'max-width', '200px'),
																A2($elm$html$Html$Attributes$style, 'word-break', 'break-all'),
																$elm$html$Html$Attributes$class('monospace')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(field)
															])),
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																A2($elm$html$Html$Attributes$style, 'max-width', '60%')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(desc)
															]))
													]));
										},
										$author$project$Data$fields))),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('column')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Valid types for resistance and weakness:'),
										A2(
										$elm$html$Html$div,
										_List_Nil,
										A2(
											$elm$core$List$intersperse,
											$elm$html$Html$text(', '),
											A2(
												$elm$core$List$map,
												function (type_) {
													return A2(
														$elm$html$Html$span,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('monospace')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(type_)
															]));
												},
												$author$project$Data$damageTypes)))
									]))
							])),
						A2(
						$elm$html$Html$h3,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Example queries')
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Spells or cantrips unique to the arcane tradition:')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('monospace')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('tradition:(arcane -divine -occult -primal) type:(spell OR cantrip)')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Evil deities with dagger as their favored weapon:')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('monospace')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('alignment:?E favored_weapon:dagger')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Non-consumable items between 500 and 1000 gp:')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('monospace')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('price:[50000 TO 100000] NOT trait:consumable')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Spells up to level 5 with a range of at least 100 feet that are granted by any sorcerer bloodline:')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('monospace')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('type:spell level:<=5 range:>=100 bloodline:*')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Rules pages that mention \'mental damage\':')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('monospace')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('\"mental damage\" type:rules')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Weapons with finesse and either disarm or trip:')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('monospace')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('type:weapon trait:finesse trait:(disarm OR trip)')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Creatures resistant to fire but not all damage:')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('monospace')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('resistance.fire:* NOT resistance.all:*')
									]))
							]))
					])) : $elm$html$Html$text('')
			]));
};
var $author$project$NethysSearch$RemoveAllSortsPressed = {$: 11};
var $author$project$NethysSearch$SortAbilityChanged = function (a) {
	return {$: 23, a: a};
};
var $author$project$NethysSearch$SortResistanceChanged = function (a) {
	return {$: 26, a: a};
};
var $author$project$NethysSearch$SortWeaknessChanged = function (a) {
	return {$: 27, a: a};
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$select = _VirtualDom_node('select');
var $author$project$NethysSearch$SortAdded = F2(
	function (a, b) {
		return {$: 24, a: a, b: b};
	});
var $author$project$NethysSearch$viewSortButtons = F2(
	function (model, field) {
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						A2(
							$elm$core$List$member,
							_Utils_Tuple2(field, 0),
							model.d) ? $author$project$NethysSearch$SortRemoved(field) : A2($author$project$NethysSearch$SortAdded, field, 0)),
						$elm$html$Html$Attributes$class(
						A2(
							$elm$core$List$member,
							_Utils_Tuple2(field, 0),
							model.d) ? 'active' : 'excluded')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Asc')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						A2(
							$elm$core$List$member,
							_Utils_Tuple2(field, 1),
							model.d) ? $author$project$NethysSearch$SortRemoved(field) : A2($author$project$NethysSearch$SortAdded, field, 1)),
						$elm$html$Html$Attributes$class(
						A2(
							$elm$core$List$member,
							_Utils_Tuple2(field, 1),
							model.d) ? 'active' : 'excluded')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Desc')
					]))
			]);
	});
var $author$project$NethysSearch$viewSortResults = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('option-container'),
				$elm$html$Html$Attributes$class('column')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Sort results')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('gap-large')
					]),
				$elm$core$List$concat(
					_List_fromArray(
						[
							_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$NethysSearch$RemoveAllSortsPressed)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Reset selection')
									]))
							]),
							A2(
							$elm$core$List$map,
							function (field) {
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('row'),
											$elm$html$Html$Attributes$class('gap-tiny'),
											$elm$html$Html$Attributes$class('align-baseline')
										]),
									A2(
										$elm$core$List$append,
										_List_fromArray(
											[
												$elm$html$Html$text(
												$author$project$NethysSearch$sortFieldToLabel(field))
											]),
										A2($author$project$NethysSearch$viewSortButtons, model, field)));
							},
							_List_fromArray(
								['name.keyword', 'level', 'type', 'price', 'bulk', 'range', 'hp', 'ac', 'fortitude_save', 'reflex_save', 'will_save', 'perception'])),
							_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row'),
										$elm$html$Html$Attributes$class('gap-tiny'),
										$elm$html$Html$Attributes$class('align-baseline')
									]),
								A2(
									$elm$core$List$append,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$select,
											_List_fromArray(
												[
													$elm$html$Html$Events$onInput($author$project$NethysSearch$SortAbilityChanged)
												]),
											A2(
												$elm$core$List$map,
												function (ability) {
													return A2(
														$elm$html$Html$option,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$value(ability)
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(
																$author$project$NethysSearch$sortFieldToLabel(ability))
															]));
												},
												_List_fromArray(
													['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'])))
										]),
									A2($author$project$NethysSearch$viewSortButtons, model, model.aA))),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row'),
										$elm$html$Html$Attributes$class('gap-tiny'),
										$elm$html$Html$Attributes$class('align-baseline')
									]),
								A2(
									$elm$core$List$append,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$select,
											_List_fromArray(
												[
													$elm$html$Html$Events$onInput($author$project$NethysSearch$SortResistanceChanged)
												]),
											A2(
												$elm$core$List$map,
												function (type_) {
													return A2(
														$elm$html$Html$option,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$value(type_)
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(
																$author$project$NethysSearch$sortFieldToLabel('resistance.' + type_))
															]));
												},
												$author$project$Data$damageTypes))
										]),
									A2($author$project$NethysSearch$viewSortButtons, model, 'resistance.' + model.aB))),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row'),
										$elm$html$Html$Attributes$class('gap-tiny'),
										$elm$html$Html$Attributes$class('align-baseline')
									]),
								A2(
									$elm$core$List$append,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$select,
											_List_fromArray(
												[
													$elm$html$Html$Events$onInput($author$project$NethysSearch$SortWeaknessChanged)
												]),
											A2(
												$elm$core$List$map,
												function (type_) {
													return A2(
														$elm$html$Html$option,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$value(type_)
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(
																$author$project$NethysSearch$sortFieldToLabel('weakness.' + type_))
															]));
												},
												$author$project$Data$damageTypes))
										]),
									A2($author$project$NethysSearch$viewSortButtons, model, 'weakness.' + model.aC)))
							])
						])))
			]));
};
var $author$project$NethysSearch$viewQueryOptions = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('column'),
				$elm$html$Html$Attributes$class('gap-small')
			]),
		_List_fromArray(
			[
				$author$project$NethysSearch$viewQueryType(model),
				$author$project$NethysSearch$viewFilterTypes(model),
				$author$project$NethysSearch$viewFilterTraits(model),
				$author$project$NethysSearch$viewSortResults(model)
			]));
};
var $author$project$NethysSearch$viewQuery = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('column'),
				$elm$html$Html$Attributes$class('align-stretch'),
				$elm$html$Html$Attributes$class('gap-tiny'),
				A2($elm$html$Html$Attributes$style, 'position', 'relative')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('input-container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$autofocus(true),
								$elm$html$Html$Attributes$class('query-input'),
								$elm$html$Html$Attributes$placeholder('Enter search query'),
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$value(model.i),
								$elm$html$Html$Events$onInput($author$project$NethysSearch$QueryChanged)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(model.i)
							])),
						$elm$core$String$isEmpty(model.i) ? $elm$html$Html$text('') : A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('input-button'),
								A2($elm$html$Html$Attributes$style, 'font-size', '24px'),
								$elm$html$Html$Events$onClick(
								$author$project$NethysSearch$QueryChanged(''))
							]),
						_List_fromArray(
							[
								$lattyware$elm_fontawesome$FontAwesome$Icon$viewIcon($lattyware$elm_fontawesome$FontAwesome$Solid$times)
							]))
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('gap-tiny'),
						$elm$html$Html$Events$onClick(
						$author$project$NethysSearch$ShowQueryOptionsPressed(!model.U)),
						A2($elm$html$Html$Attributes$style, 'align-self', 'center')
					]),
				model.U ? _List_fromArray(
					[
						$lattyware$elm_fontawesome$FontAwesome$Icon$viewIcon($lattyware$elm_fontawesome$FontAwesome$Solid$chevronUp),
						$elm$html$Html$text('Hide filters and options'),
						$lattyware$elm_fontawesome$FontAwesome$Icon$viewIcon($lattyware$elm_fontawesome$FontAwesome$Solid$chevronUp)
					]) : _List_fromArray(
					[
						$lattyware$elm_fontawesome$FontAwesome$Icon$viewIcon($lattyware$elm_fontawesome$FontAwesome$Solid$chevronDown),
						$elm$html$Html$text(' Show filters and options'),
						$lattyware$elm_fontawesome$FontAwesome$Icon$viewIcon($lattyware$elm_fontawesome$FontAwesome$Solid$chevronDown)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('query-options-dummy'),
						$elm$html$Html$Attributes$id($author$project$NethysSearch$queryOptionsDummyId)
					]),
				_List_fromArray(
					[
						$author$project$NethysSearch$viewQueryOptions(model)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('query-options-container'),
						A2(
						$elm$html$Html$Attributes$style,
						'height',
						model.U ? ($elm$core$String$fromInt(model.az) + 'px') : '0')
					]),
				_List_fromArray(
					[
						$author$project$NethysSearch$viewQueryOptions(model)
					])),
				(model.z === 1) ? A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Query type: Complex')
					])) : (A2($author$project$NethysSearch$stringContainsChar, model.i, ':()\"') ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('option-container'),
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('align-center'),
						$elm$html$Html$Attributes$class('nowrap')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'font-size', '24px'),
								A2($elm$html$Html$Attributes$style, 'padding', '4px')
							]),
						_List_fromArray(
							[
								$lattyware$elm_fontawesome$FontAwesome$Icon$viewIcon($lattyware$elm_fontawesome$FontAwesome$Solid$exclamation)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick(
								$author$project$NethysSearch$QueryTypeSelected(1))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Your query contains characters that can be used with the complex query type, but you are currently using the standard query type. Would you like to '),
								A2(
								$elm$html$Html$button,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('switch to complex query type')
									])),
								$elm$html$Html$text('?')
							]))
					])) : $elm$html$Html$text('')),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('gap-medium')
					]),
				_List_fromArray(
					[
						$author$project$NethysSearch$viewIncludeFilters(model),
						$author$project$NethysSearch$viewExcludeFilters(model)
					])),
				$elm$core$List$isEmpty(model.d) ? $elm$html$Html$text('') : A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('gap-tiny'),
						$elm$html$Html$Attributes$class('align-baseline')
					]),
				$elm$core$List$concat(
					_List_fromArray(
						[
							_List_fromArray(
							[
								$elm$html$Html$text('Sort by:')
							]),
							A2(
							$elm$core$List$map,
							function (_v0) {
								var field = _v0.a;
								var dir = _v0.b;
								return A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(
											$author$project$NethysSearch$SortRemoved(field))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$NethysSearch$sortFieldToLabel(field) + (' ' + $author$project$NethysSearch$sortDirToString(dir)))
										]));
							},
							model.d)
						])))
			]));
};
var $author$project$NethysSearch$LoadMorePressed = {$: 5};
var $author$project$NethysSearch$ScrollToTopPressed = {$: 16};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm_community$maybe_extra$Maybe$Extra$isJust = function (m) {
	if (m.$ === 1) {
		return false;
	} else {
		return true;
	}
};
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $author$project$NethysSearch$getUrl = function (doc) {
	return 'https://2e.aonprd.com/' + doc.O;
};
var $author$project$NethysSearch$nonEmptyList = function (list) {
	return $elm$core$List$isEmpty(list) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(list);
};
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$NethysSearch$numberWithSign = function (_int) {
	return (_int >= 0) ? ('+' + $elm$core$String$fromInt(_int)) : $elm$core$String$fromInt(_int);
};
var $author$project$NethysSearch$viewLabel = function (text) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('bold')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(text)
			]));
};
var $author$project$NethysSearch$replaceActionLigatures = F3(
	function (text, _v0, rem) {
		replaceActionLigatures:
		while (true) {
			var find = _v0.a;
			var replace = _v0.b;
			if (A2($elm$core$String$contains, find, text)) {
				var _v1 = A2($elm$core$String$split, find, text);
				if (_v1.b) {
					var before = _v1.a;
					var after = _v1.b;
					return A2(
						$elm$core$List$append,
						_List_fromArray(
							[
								$elm$html$Html$text(before),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('icon-font')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(replace)
									]))
							]),
						A3(
							$author$project$NethysSearch$replaceActionLigatures,
							A2($elm$core$String$join, find, after),
							_Utils_Tuple2(find, replace),
							rem));
				} else {
					return _List_fromArray(
						[
							$elm$html$Html$text(text)
						]);
				}
			} else {
				if (rem.b) {
					var next = rem.a;
					var remNext = rem.b;
					var $temp$text = text,
						$temp$_v0 = next,
						$temp$rem = remNext;
					text = $temp$text;
					_v0 = $temp$_v0;
					rem = $temp$rem;
					continue replaceActionLigatures;
				} else {
					return _List_fromArray(
						[
							$elm$html$Html$text(text)
						]);
				}
			}
		}
	});
var $author$project$NethysSearch$viewTextWithActionIcons = function (text) {
	return A2(
		$elm$html$Html$span,
		_List_Nil,
		A3(
			$author$project$NethysSearch$replaceActionLigatures,
			text,
			_Utils_Tuple2('Single Action', '[one-action]'),
			_List_fromArray(
				[
					_Utils_Tuple2('Two Actions', '[two-actions]'),
					_Utils_Tuple2('Three Actions', '[three-actions]'),
					_Utils_Tuple2('Reaction', '[reaction]'),
					_Utils_Tuple2('Free Action', '[free-action]')
				])));
};
var $author$project$NethysSearch$viewLabelAndText = F2(
	function (label, text) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					$author$project$NethysSearch$viewLabel(label),
					$elm$html$Html$text(' '),
					$author$project$NethysSearch$viewTextWithActionIcons(text)
				]));
	});
var $author$project$NethysSearch$viewLabelAndPluralizedText = F3(
	function (singular, plural, strings) {
		return A2(
			$author$project$NethysSearch$viewLabelAndText,
			($elm$core$List$length(strings) > 1) ? plural : singular,
			A2($elm$core$String$join, ', ', strings));
	});
var $author$project$NethysSearch$viewSearchResultAdditionalInfo = function (hit) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('column'),
				$elm$html$Html$Attributes$class('gap-tiny')
			]),
		A2(
			$elm$core$List$append,
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					$elm$core$Maybe$map,
					$elm$core$List$singleton,
					A2(
						$elm$core$Maybe$map,
						$author$project$NethysSearch$viewLabelAndText('Source'),
						hit.a.a))),
			function () {
				var _v0 = hit.a.ao;
				switch (_v0) {
					case 'action':
						return $elm_community$maybe_extra$Maybe$Extra$values(
							_List_fromArray(
								[
									A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Frequency'),
									hit.a.aa),
									A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Trigger'),
									hit.a.Y),
									A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Requirements'),
									hit.a.ag)
								]));
					case 'background':
						return $elm_community$maybe_extra$Maybe$Extra$values(
							_List_fromArray(
								[
									A2(
									$elm$core$Maybe$map,
									A2($author$project$NethysSearch$viewLabelAndPluralizedText, 'Ability', 'Abilities'),
									$author$project$NethysSearch$nonEmptyList(hit.a.aH)),
									A2(
									$elm$core$Maybe$map,
									A2($author$project$NethysSearch$viewLabelAndPluralizedText, 'Feat', 'Feats'),
									$author$project$NethysSearch$nonEmptyList(hit.a.a1)),
									A2(
									$elm$core$Maybe$map,
									A2($author$project$NethysSearch$viewLabelAndPluralizedText, 'Skill', 'Skills'),
									$author$project$NethysSearch$nonEmptyList(hit.a.aD))
								]));
					case 'bloodline':
						return A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							A2(
								$elm$core$Maybe$map,
								$elm$core$List$singleton,
								A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Spell List'),
									hit.a.aE)));
					case 'creature':
						return $elm_community$maybe_extra$Maybe$Extra$values(
							_List_fromArray(
								[
									A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Creature Family'),
									hit.a.aW),
									$elm$core$Maybe$Just(
									A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('row'),
												$elm$html$Html$Attributes$class('gap-medium')
											]),
										$elm_community$maybe_extra$Maybe$Extra$values(
											_List_fromArray(
												[
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('HP'),
													A2($elm$core$Maybe$map, $elm$core$String$fromInt, hit.a.a4)),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('AC'),
													A2($elm$core$Maybe$map, $elm$core$String$fromInt, hit.a.aJ)),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Fort'),
													A2($elm$core$Maybe$map, $author$project$NethysSearch$numberWithSign, hit.a.a2)),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Ref'),
													A2($elm$core$Maybe$map, $author$project$NethysSearch$numberWithSign, hit.a.bg)),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Will'),
													A2($elm$core$Maybe$map, $author$project$NethysSearch$numberWithSign, hit.a.bB)),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Perception'),
													A2($elm$core$Maybe$map, $author$project$NethysSearch$numberWithSign, hit.a.bd))
												])))),
									$elm$core$Maybe$Just(
									A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('row'),
												$elm$html$Html$Attributes$class('gap-medium')
											]),
										$elm_community$maybe_extra$Maybe$Extra$values(
											_List_fromArray(
												[
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Str'),
													A2($elm$core$Maybe$map, $author$project$NethysSearch$numberWithSign, hit.a.bs)),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Dex'),
													A2($elm$core$Maybe$map, $author$project$NethysSearch$numberWithSign, hit.a.aY)),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Con'),
													A2($elm$core$Maybe$map, $author$project$NethysSearch$numberWithSign, hit.a.aU)),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Int'),
													A2($elm$core$Maybe$map, $author$project$NethysSearch$numberWithSign, hit.a.a6)),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Wis'),
													A2($elm$core$Maybe$map, $author$project$NethysSearch$numberWithSign, hit.a.bC)),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Cha'),
													A2($elm$core$Maybe$map, $author$project$NethysSearch$numberWithSign, hit.a.aS))
												])))),
									$elm$core$Maybe$Just(
									A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('row'),
												$elm$html$Html$Attributes$class('gap-medium')
											]),
										$elm_community$maybe_extra$Maybe$Extra$values(
											_List_fromArray(
												[
													A2(
													$elm$core$Maybe$map,
													A2($author$project$NethysSearch$viewLabelAndPluralizedText, 'Immunity', 'Immunities'),
													$author$project$NethysSearch$nonEmptyList(hit.a.a5)),
													A2(
													$elm$core$Maybe$map,
													A2($author$project$NethysSearch$viewLabelAndPluralizedText, 'Resistance', 'Resistances'),
													$author$project$NethysSearch$nonEmptyList(hit.a.bj)),
													A2(
													$elm$core$Maybe$map,
													A2($author$project$NethysSearch$viewLabelAndPluralizedText, 'Weakness', 'Weaknesses'),
													$author$project$NethysSearch$nonEmptyList(hit.a.by))
												]))))
								]));
					case 'deity':
						return $elm_community$maybe_extra$Maybe$Extra$values(
							_List_fromArray(
								[
									A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Divine Font'),
									hit.a.aZ),
									A2(
									$elm$core$Maybe$map,
									A2($author$project$NethysSearch$viewLabelAndPluralizedText, 'Divine Skill', 'Divine Skills'),
									$author$project$NethysSearch$nonEmptyList(hit.a.aD)),
									A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Favored Weapon'),
									hit.a.a0),
									A2(
									$elm$core$Maybe$map,
									A2($author$project$NethysSearch$viewLabelAndPluralizedText, 'Domain', 'Domains'),
									$author$project$NethysSearch$nonEmptyList(hit.a.ar))
								]));
					case 'domain':
						return $elm_community$maybe_extra$Maybe$Extra$values(
							_List_fromArray(
								[
									A2(
									$elm$core$Maybe$map,
									A2($author$project$NethysSearch$viewLabelAndPluralizedText, 'Deity', 'Deities'),
									$author$project$NethysSearch$nonEmptyList(hit.a.aq)),
									$elm$core$Maybe$Just(
									A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('row'),
												$elm$html$Html$Attributes$class('gap-medium')
											]),
										$elm_community$maybe_extra$Maybe$Extra$values(
											_List_fromArray(
												[
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Domain Spell'),
													hit.a.a_),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Advanced Domain Spell'),
													hit.a.aM)
												]))))
								]));
					case 'equipment':
						return $elm_community$maybe_extra$Maybe$Extra$values(
							_List_fromArray(
								[
									A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Price'),
									hit.a.ay),
									$elm$core$Maybe$Just(
									A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('row'),
												$elm$html$Html$Attributes$class('gap-medium')
											]),
										$elm_community$maybe_extra$Maybe$Extra$values(
											_List_fromArray(
												[
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Hands'),
													hit.a.at),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Usage'),
													hit.a.bx),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Bulk'),
													hit.a.am)
												])))),
									$elm$core$Maybe$Just(
									A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('row'),
												$elm$html$Html$Attributes$class('gap-medium')
											]),
										$elm_community$maybe_extra$Maybe$Extra$values(
											_List_fromArray(
												[
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Activate'),
													hit.a.aL),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Frequency'),
													hit.a.aa),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Trigger'),
													hit.a.Y)
												]))))
								]));
					case 'familiar':
						return A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							A2(
								$elm$core$Maybe$map,
								$elm$core$List$singleton,
								A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Ability Type'),
									hit.a.aI)));
					case 'familiar-specific':
						return $elm_community$maybe_extra$Maybe$Extra$values(
							_List_fromArray(
								[
									A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Required Number of Abilities'),
									hit.a.bi),
									A2(
									$elm$core$Maybe$map,
									A2($author$project$NethysSearch$viewLabelAndPluralizedText, 'Granted Ability', 'Granted Abilities'),
									$author$project$NethysSearch$nonEmptyList(hit.a.a$))
								]));
					case 'feat':
						return $elm_community$maybe_extra$Maybe$Extra$values(
							_List_fromArray(
								[
									A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Frequency'),
									hit.a.aa),
									A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Prerequisites'),
									hit.a.ax),
									A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Trigger'),
									hit.a.Y),
									A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Requirements'),
									hit.a.ag)
								]));
					case 'lesson':
						return A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							A2(
								$elm$core$Maybe$map,
								$elm$core$List$singleton,
								A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Lesson Type'),
									hit.a.a7)));
					case 'patron':
						return A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							A2(
								$elm$core$Maybe$map,
								$elm$core$List$singleton,
								A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Spell List'),
									hit.a.aE)));
					case 'relic':
						return $elm_community$maybe_extra$Maybe$Extra$values(
							_List_fromArray(
								[
									A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Aspect'),
									hit.a.aP),
									A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Prerequisite'),
									hit.a.ax)
								]));
					case 'ritual':
						return _List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row'),
										$elm$html$Html$Attributes$class('gap-medium')
									]),
								$elm_community$maybe_extra$Maybe$Extra$values(
									_List_fromArray(
										[
											A2(
											$elm$core$Maybe$map,
											$author$project$NethysSearch$viewLabelAndText('Cast'),
											hit.a.an),
											A2(
											$elm$core$Maybe$map,
											$author$project$NethysSearch$viewLabelAndText('Cost'),
											hit.a.aV),
											A2(
											$elm$core$Maybe$map,
											$author$project$NethysSearch$viewLabelAndText('Secondary Casters'),
											hit.a.bm)
										]))),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row'),
										$elm$html$Html$Attributes$class('gap-medium')
									]),
								$elm_community$maybe_extra$Maybe$Extra$values(
									_List_fromArray(
										[
											A2(
											$elm$core$Maybe$map,
											$author$project$NethysSearch$viewLabelAndText('Primary Check'),
											hit.a.bf),
											A2(
											$elm$core$Maybe$map,
											$author$project$NethysSearch$viewLabelAndText('Secondary Checks'),
											hit.a.bn)
										]))),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row'),
										$elm$html$Html$Attributes$class('gap-medium')
									]),
								$elm_community$maybe_extra$Maybe$Extra$values(
									_List_fromArray(
										[
											A2(
											$elm$core$Maybe$map,
											$author$project$NethysSearch$viewLabelAndText('Range'),
											hit.a.af),
											A2(
											$elm$core$Maybe$map,
											$author$project$NethysSearch$viewLabelAndText('Targets'),
											hit.a.aF)
										]))),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row'),
										$elm$html$Html$Attributes$class('gap-medium')
									]),
								$elm_community$maybe_extra$Maybe$Extra$values(
									_List_fromArray(
										[
											A2(
											$elm$core$Maybe$map,
											$author$project$NethysSearch$viewLabelAndText('Duration'),
											hit.a.as)
										]))),
								A2(
								$elm$core$Maybe$withDefault,
								$elm$html$Html$text(''),
								A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Heightened'),
									$elm_community$string_extra$String$Extra$nonEmpty(
										A2($elm$core$String$join, ', ', hit.a.au))))
							]);
					case 'rules':
						return A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							A2(
								$elm$core$Maybe$map,
								$elm$core$List$singleton,
								A2($elm$core$Maybe$map, $elm$html$Html$text, hit.a.aR)));
					case 'spell':
						return $elm_community$maybe_extra$Maybe$Extra$values(
							_List_fromArray(
								[
									A2(
									$elm$core$Maybe$map,
									A2($author$project$NethysSearch$viewLabelAndPluralizedText, 'Tradition', 'Traditions'),
									$author$project$NethysSearch$nonEmptyList(hit.a.bu)),
									$elm$core$Maybe$Just(
									A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('row'),
												$elm$html$Html$Attributes$class('gap-medium')
											]),
										$elm_community$maybe_extra$Maybe$Extra$values(
											_List_fromArray(
												[
													A2(
													$elm$core$Maybe$map,
													A2($author$project$NethysSearch$viewLabelAndPluralizedText, 'Bloodline', 'Bloodlines'),
													$author$project$NethysSearch$nonEmptyList(hit.a.aQ)),
													A2(
													$elm$core$Maybe$map,
													A2($author$project$NethysSearch$viewLabelAndPluralizedText, 'Domain', 'Domains'),
													$author$project$NethysSearch$nonEmptyList(hit.a.ar)),
													A2(
													$elm$core$Maybe$map,
													A2($author$project$NethysSearch$viewLabelAndPluralizedText, 'Mystery', 'Mysteries'),
													$author$project$NethysSearch$nonEmptyList(hit.a.ba)),
													A2(
													$elm$core$Maybe$map,
													A2($author$project$NethysSearch$viewLabelAndPluralizedText, 'Patron Theme', 'Patron Themes'),
													$author$project$NethysSearch$nonEmptyList(hit.a.bc)),
													A2(
													$elm$core$Maybe$map,
													A2($author$project$NethysSearch$viewLabelAndPluralizedText, 'Deity', 'Deities'),
													$author$project$NethysSearch$nonEmptyList(hit.a.aq))
												])))),
									$elm$core$Maybe$Just(
									A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('row'),
												$elm$html$Html$Attributes$class('gap-medium')
											]),
										$elm_community$maybe_extra$Maybe$Extra$values(
											_List_fromArray(
												[
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Cast'),
													hit.a.an),
													A2(
													$elm$core$Maybe$map,
													A2($author$project$NethysSearch$viewLabelAndPluralizedText, 'Component', 'Components'),
													$author$project$NethysSearch$nonEmptyList(hit.a.aT)),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Trigger'),
													hit.a.Y),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Requirements'),
													hit.a.ag)
												])))),
									$elm$core$Maybe$Just(
									A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('row'),
												$elm$html$Html$Attributes$class('gap-medium')
											]),
										$elm_community$maybe_extra$Maybe$Extra$values(
											_List_fromArray(
												[
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Range'),
													hit.a.af),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Targets'),
													hit.a.aF),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Area'),
													hit.a.aO)
												])))),
									$elm$core$Maybe$Just(
									A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('row'),
												$elm$html$Html$Attributes$class('gap-medium')
											]),
										$elm_community$maybe_extra$Maybe$Extra$values(
											_List_fromArray(
												[
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Duration'),
													hit.a.as),
													A2(
													$elm$core$Maybe$map,
													$author$project$NethysSearch$viewLabelAndText('Saving Throw'),
													hit.a.bl)
												])))),
									A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Heightened'),
									$elm_community$string_extra$String$Extra$nonEmpty(
										A2($elm$core$String$join, ', ', hit.a.au)))
								]));
					case 'weapon':
						return _List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row'),
										$elm$html$Html$Attributes$class('gap-medium')
									]),
								$elm_community$maybe_extra$Maybe$Extra$values(
									_List_fromArray(
										[
											A2(
											$elm$core$Maybe$map,
											$author$project$NethysSearch$viewLabelAndText('Price'),
											hit.a.ay),
											A2(
											$elm$core$Maybe$map,
											$author$project$NethysSearch$viewLabelAndText('Damage'),
											hit.a.aX),
											A2(
											$elm$core$Maybe$map,
											$author$project$NethysSearch$viewLabelAndText('Bulk'),
											hit.a.am)
										]))),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row'),
										$elm$html$Html$Attributes$class('gap-medium')
									]),
								$elm_community$maybe_extra$Maybe$Extra$values(
									_List_fromArray(
										[
											A2(
											$elm$core$Maybe$map,
											$author$project$NethysSearch$viewLabelAndText('Hands'),
											hit.a.at),
											A2(
											$elm$core$Maybe$map,
											$author$project$NethysSearch$viewLabelAndText('Range'),
											hit.a.af),
											A2(
											$elm$core$Maybe$map,
											$author$project$NethysSearch$viewLabelAndText('Reload'),
											hit.a.bh)
										]))),
								A2(
								$elm$core$Maybe$withDefault,
								$elm$html$Html$text(''),
								A2(
									$elm$core$Maybe$map,
									$author$project$NethysSearch$viewLabelAndText('Ammunition'),
									hit.a.aN)),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row'),
										$elm$html$Html$Attributes$class('gap-medium')
									]),
								$elm_community$maybe_extra$Maybe$Extra$values(
									_List_fromArray(
										[
											A2(
											$elm$core$Maybe$map,
											$author$project$NethysSearch$viewLabelAndText('Category'),
											hit.a.bz),
											A2(
											$elm$core$Maybe$map,
											$author$project$NethysSearch$viewLabelAndText('Group'),
											hit.a.bA)
										])))
							]);
					default:
						return _List_Nil;
				}
			}()));
};
var $author$project$NethysSearch$viewTrait = function (trait) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('trait'),
				function () {
				switch (trait) {
					case 'Uncommon':
						return $elm$html$Html$Attributes$class('trait-uncommon');
					case 'Rare':
						return $elm$html$Html$Attributes$class('trait-rare');
					case 'Unique':
						return $elm$html$Html$Attributes$class('trait-unique');
					case 'Tiny':
						return $elm$html$Html$Attributes$class('trait-size');
					case 'Small':
						return $elm$html$Html$Attributes$class('trait-size');
					case 'Medium':
						return $elm$html$Html$Attributes$class('trait-size');
					case 'Large':
						return $elm$html$Html$Attributes$class('trait-size');
					case 'Huge':
						return $elm$html$Html$Attributes$class('trait-size');
					case 'Gargantuan':
						return $elm$html$Html$Attributes$class('trait-size');
					case 'No Alignment':
						return $elm$html$Html$Attributes$class('trait-alignment');
					case 'LG':
						return $elm$html$Html$Attributes$class('trait-alignment');
					case 'LN':
						return $elm$html$Html$Attributes$class('trait-alignment');
					case 'LE':
						return $elm$html$Html$Attributes$class('trait-alignment');
					case 'NG':
						return $elm$html$Html$Attributes$class('trait-alignment');
					case 'N':
						return $elm$html$Html$Attributes$class('trait-alignment');
					case 'NE':
						return $elm$html$Html$Attributes$class('trait-alignment');
					case 'CG':
						return $elm$html$Html$Attributes$class('trait-alignment');
					case 'CN':
						return $elm$html$Html$Attributes$class('trait-alignment');
					case 'CE':
						return $elm$html$Html$Attributes$class('trait-alignment');
					default:
						return $elm_community$html_extra$Html$Attributes$Extra$empty;
				}
			}()
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(trait)
			]));
};
var $author$project$NethysSearch$viewSingleSearchResult = F2(
	function (model, hit) {
		var hasActionsInTitle = A2(
			$elm$core$List$member,
			hit.a.ao,
			_List_fromArray(
				['action', 'creature-ability', 'feat']));
		return A2(
			$elm$html$Html$section,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('column'),
					$elm$html$Html$Attributes$class('gap-small')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h2,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('title')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$href(
											$author$project$NethysSearch$getUrl(hit.a)),
											$elm$html$Html$Attributes$target('_blank')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(hit.a.p)
										])),
									function () {
									var _v0 = _Utils_Tuple2(hit.a.aK, hasActionsInTitle);
									if ((!_v0.a.$) && _v0.b) {
										var actions = _v0.a.a;
										return $author$project$NethysSearch$viewTextWithActionIcons(' ' + actions);
									} else {
										return $elm$html$Html$text('');
									}
								}()
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('title-type')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(hit.a.bw),
									function () {
									var _v1 = hit.a.a8;
									if (!_v1.$) {
										var level = _v1.a;
										return $elm$html$Html$text(
											' ' + $elm$core$String$fromInt(level));
									} else {
										return $elm$html$Html$text('');
									}
								}()
								]))
						])),
					model.M ? A2(
					$elm$html$Html$h3,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('subtitle')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2(
								$elm$core$Maybe$withDefault,
								'',
								A2(
									$elm$core$Maybe$map,
									function (spoiler) {
										return 'May contain spoilers from ' + spoiler;
									},
									hit.a.bp)))
						])) : $elm$html$Html$text(''),
					model.N ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('row')
						]),
					A2($elm$core$List$map, $author$project$NethysSearch$viewTrait, hit.a.bv)) : $elm$html$Html$text(''),
					model.L ? $author$project$NethysSearch$viewSearchResultAdditionalInfo(hit) : $elm$html$Html$text('')
				]));
	});
var $author$project$NethysSearch$viewSearchResults = function (model) {
	var total = A2(
		$elm$core$Maybe$map,
		function ($) {
			return $.bt;
		},
		A2(
			$elm$core$Maybe$andThen,
			$elm$core$Result$toMaybe,
			$elm$core$List$head(model.x)));
	var resultCount = $elm$core$List$sum(
		A2(
			$elm$core$List$map,
			$elm$core$Maybe$withDefault(0),
			A2(
				$elm$core$List$map,
				$elm$core$Maybe$map($elm$core$List$length),
				A2(
					$elm$core$List$map,
					$elm$core$Maybe$map(
						function ($) {
							return $.ab;
						}),
					A2($elm$core$List$map, $elm$core$Result$toMaybe, model.x)))));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('column'),
				$elm$html$Html$Attributes$class('gap-large'),
				A2($elm$html$Html$Attributes$style, 'min-height', '500px')
			]),
		$elm$core$List$concat(
			_List_fromArray(
				[
					function () {
					if (!total.$) {
						if (total.a === 10000) {
							return _List_fromArray(
								[
									$elm$html$Html$text('10000+ results')
								]);
						} else {
							var count = total.a;
							return _List_fromArray(
								[
									$elm$html$Html$text(
									$elm$core$String$fromInt(count) + ' results')
								]);
						}
					} else {
						return _List_Nil;
					}
				}(),
					$elm$core$List$concat(
					A2(
						$elm$core$List$map,
						function (result) {
							if (!result.$) {
								var r = result.a;
								return A2(
									$elm$core$List$map,
									$author$project$NethysSearch$viewSingleSearchResult(model),
									r.ab);
							} else {
								if ((result.a.$ === 3) && (result.a.a === 400)) {
									return _List_fromArray(
										[
											A2(
											$elm$html$Html$h2,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Error: Failed to parse query')
												]))
										]);
								} else {
									return _List_fromArray(
										[
											A2(
											$elm$html$Html$h2,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Error: Search failed')
												]))
										]);
								}
							}
						},
						model.x)),
					$elm_community$maybe_extra$Maybe$Extra$isJust(model.B) ? _List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('loader')
							]),
						_List_Nil)
					]) : ((_Utils_cmp(
					resultCount,
					A2($elm$core$Maybe$withDefault, 0, total)) < 0) ? _List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$NethysSearch$LoadMorePressed),
								A2($elm$html$Html$Attributes$style, 'align-self', 'center')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Load more')
							]))
					]) : _List_Nil),
					(resultCount > 0) ? _List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$NethysSearch$ScrollToTopPressed),
								A2($elm$html$Html$Attributes$style, 'align-self', 'center')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Scroll to top')
							]))
					]) : _List_Nil
				])));
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$header = _VirtualDom_node('header');
var $author$project$NethysSearch$viewTitle = A2(
	$elm$html$Html$header,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('column'),
			$elm$html$Html$Attributes$class('align-center')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h1,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href('?')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Nethys Search')
						]))
				])),
			A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Search engine for '),
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href('https://2e.aonprd.com/'),
							$elm$html$Html$Attributes$target('_blank')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('2e.aonprd.com')
						]))
				]))
		]));
var $author$project$NethysSearch$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A3(
				$elm$html$Html$node,
				'style',
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text($author$project$NethysSearch$css),
						function () {
						var _v0 = model.j;
						switch (_v0) {
							case 0:
								return $elm$html$Html$text($author$project$NethysSearch$cssDark);
							case 3:
								return $elm$html$Html$text($author$project$NethysSearch$cssLight);
							case 4:
								return $elm$html$Html$text($author$project$NethysSearch$cssPaper);
							case 1:
								return $elm$html$Html$text($author$project$NethysSearch$cssExtraContrast);
							default:
								return $elm$html$Html$text($author$project$NethysSearch$cssLavender);
						}
					}()
					])),
				$lattyware$elm_fontawesome$FontAwesome$Styles$css,
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('body-container'),
						$elm$html$Html$Attributes$class('column'),
						$elm$html$Html$Attributes$class('align-center')
					]),
				A2(
					$elm$core$List$append,
					model.A ? _List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('menu-open-button'),
									$elm$html$Html$Events$onClick(
									$author$project$NethysSearch$ShowMenuPressed(true)),
									$elm$html$Html$Events$onMouseOver(
									$author$project$NethysSearch$ShowMenuPressed(true))
								]),
							_List_fromArray(
								[
									$lattyware$elm_fontawesome$FontAwesome$Icon$viewIcon($lattyware$elm_fontawesome$FontAwesome$Solid$bars)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('menu-overlay'),
									A2(
									$elm_community$html_extra$Html$Attributes$Extra$attributeIf,
									!model.ad,
									$elm$html$Html$Attributes$class('menu-overlay-hidden')),
									$elm$html$Html$Events$onClick(
									$author$project$NethysSearch$ShowMenuPressed(false)),
									A2(
									$elm_community$html_extra$Html$Attributes$Extra$attributeIf,
									model.T,
									$elm$html$Html$Events$onMouseOver(
										$author$project$NethysSearch$ShowMenuPressed(false)))
								]),
							_List_Nil),
							$author$project$NethysSearch$viewMenu(model)
						]) : _List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('column'),
									$elm$html$Html$Attributes$class('content-container'),
									$elm$html$Html$Attributes$class('gap-large')
								]),
							_List_fromArray(
								[
									model.A ? $author$project$NethysSearch$viewTitle : $elm$html$Html$text(''),
									A2(
									$elm$html$Html$main_,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('column gap-large')
										]),
									_List_fromArray(
										[
											$author$project$NethysSearch$viewQuery(model),
											$author$project$NethysSearch$viewSearchResults(model)
										]))
								]))
						])))
			]));
};
var $author$project$NethysSearch$main = $elm$browser$Browser$element(
	{cq: $author$project$NethysSearch$init, cJ: $author$project$NethysSearch$subscriptions, cM: $author$project$NethysSearch$update, cN: $author$project$NethysSearch$view});
_Platform_export({'NethysSearch':{'init':$author$project$NethysSearch$main($elm$json$Json$Decode$value)(0)}});}(this));