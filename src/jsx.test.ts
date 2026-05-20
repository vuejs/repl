import { transformJSX } from './jsx'

describe('transformJSX', () => {
  it('should transform JSX to JavaScript', () => {
    const jsxCode = 'const el = <div>Hello</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('Hello')
  })

  it('should transform JSX with attributes', () => {
    const jsxCode = 'const el = <div id="test" class="foo">Hello</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('"id"')
    expect(result).toContain('"test"')
    expect(result).toContain('"class"')
    expect(result).toContain('"foo"')
  })

  it('should transform JSX with children', () => {
    const jsxCode = 'const el = <div><span>Hello</span></div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('"span"')
    expect(result).toContain('Hello')
  })

  it('should transform JSX with expressions', () => {
    const jsxCode = 'const el = <div>{name}</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('name')
  })

  it('should transform JSX with event handlers', () => {
    const jsxCode = 'const el = <div onClick={handleClick}>Click</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('onClick')
    expect(result).toContain('handleClick')
  })

  it('should transform JSX fragments', () => {
    const jsxCode = 'const el = <><div>First</div><div>Second</div></>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('Fragment')
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('First')
    expect(result).toContain('Second')
  })

  it('should transform JSX with spread attributes', () => {
    const jsxCode = 'const el = <div {...props}>Hello</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('props')
  })

  it('should transform JSX with self-closing tags', () => {
    const jsxCode = 'const el = <img src="test.png" />'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"img"')
    expect(result).toContain('"src"')
    expect(result).toContain('"test.png"')
  })

  it('should transform JSX with component tags', () => {
    const jsxCode = 'const el = <MyComponent prop="value" />'
    const result = transformJSX(jsxCode)
    expect(result).toContain('resolveComponent')
    expect(result).toContain('createVNode')
    expect(result).toContain('MyComponent')
    expect(result).toContain('"prop"')
    expect(result).toContain('"value"')
  })

  it('should transform JSX with dynamic component names', () => {
    const jsxCode = 'const el = <Component is={MyComponent} />'
    const result = transformJSX(jsxCode)
    expect(result).toContain('resolveComponent')
    expect(result).toContain('createVNode')
  })

  it('should transform JSX with template literals in attributes', () => {
    const jsxCode = 'const el = <div class={`foo-${bar}`}>Hello</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('`foo-${bar}`')
  })

  it('should transform JSX with null/undefined children', () => {
    const jsxCode = 'const el = <div>{null}{undefined}</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('null')
    expect(result).toContain('undefined')
  })

  it('should transform JSX with boolean attributes', () => {
    const jsxCode = 'const el = <input disabled />'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"input"')
    expect(result).toContain('disabled')
  })

  it('should transform JSX with comments', () => {
    const jsxCode = 'const el = <div>{/* comment */}Hello</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('Hello')
  })

  it('should transform JSX in arrow functions', () => {
    const jsxCode = 'const Component = () => <div>Hello</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('Hello')
  })

  it('should transform JSX in function declarations', () => {
    const jsxCode = 'function Component() { return <div>Hello</div> }'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('Hello')
  })

  it('should transform JSX with multiple attributes', () => {
    const jsxCode =
      'const el = <div id="test" class="foo" data-value="123">Hello</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('"id"')
    expect(result).toContain('"class"')
    expect(result).toContain('"data-value"')
  })

  it('should transform JSX with nested expressions', () => {
    const jsxCode = 'const el = <div>{foo.bar.baz}</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('foo.bar.baz')
  })

  it('should transform JSX with conditional rendering', () => {
    const jsxCode =
      'const el = <div>{condition ? <span>Yes</span> : <span>No</span>}</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('"span"')
    expect(result).toContain('condition')
    expect(result).toContain('Yes')
    expect(result).toContain('No')
  })

  it('should transform JSX with list rendering', () => {
    const jsxCode =
      'const el = <div>{items.map(item => <span key={item.id}>{item.name}</span>)}</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('"span"')
    expect(result).toContain('key')
    expect(result).toContain('item.id')
  })

  it('should handle empty JSX element', () => {
    const jsxCode = 'const el = <div></div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
  })

  it('should transform JSX with reserved attributes (className, htmlFor)', () => {
    const jsxCode =
      'const el = <div className="test" htmlFor="input">Label</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('className')
    expect(result).toContain('htmlFor')
  })

  it('should transform JSX with style object', () => {
    const jsxCode =
      'const el = <div style={{ color: "red", fontSize: 14 }}>Hello</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('style')
    expect(result).toContain('color')
    expect(result).toContain('fontSize')
  })

  it('should transform JSX with array children', () => {
    const jsxCode =
      'const el = <div>{[1, 2, 3].map(n => <span>{n}</span>)}</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('"span"')
    expect(result).toContain('map')
  })

  it('should transform JSX with function call in expression', () => {
    const jsxCode = 'const el = <div>{getMessage()}</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('getMessage()')
  })

  it('should transform JSX with ternary in attribute', () => {
    const jsxCode =
      'const el = <div className={isActive ? "active" : "inactive"}>Hello</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('className')
    expect(result).toContain('isActive')
  })

  it('should transform JSX with destructured props', () => {
    const jsxCode = 'const Component = ({ name }) => <div>Hello {name}</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('name')
  })

  it('should transform JSX with rest props', () => {
    const jsxCode =
      'const Component = ({ name, ...rest }) => <div {...rest}>{name}</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('rest')
    expect(result).toContain('name')
  })

  it('should transform JSX with key attribute', () => {
    const jsxCode = 'const el = <div key="unique">Hello</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('key')
  })

  it('should transform JSX with ref attribute', () => {
    const jsxCode = 'const el = <div ref={myRef}>Hello</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('ref')
    expect(result).toContain('myRef')
  })

  it('should transform JSX with dangerouslySetInnerHTML', () => {
    const jsxCode =
      'const el = <div dangerouslySetInnerHTML={{ __html: html }} />'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('dangerouslySetInnerHTML')
    expect(result).toContain('__html')
  })

  it('should transform JSX with custom namespace elements', () => {
    const jsxCode = 'const el = <svg><path d="M0 0" /></svg>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"svg"')
    expect(result).toContain('"path"')
  })

  it('should transform JSX with mixed content', () => {
    const jsxCode = `
      const Component = () => {
        const items = [1, 2, 3]
        return (
          <div className="container">
            <h1>Title</h1>
            {items.map(item => (
              <span key={item}>{item}</span>
            ))}
          </div>
        )
      }
    `
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('"h1"')
    expect(result).toContain('"span"')
    expect(result).toContain('Title')
    expect(result).toContain('className')
    expect(result).toContain('key')
  })

  it('should return code as a string', () => {
    const jsxCode = 'const el = <div>Hello</div>'
    const result = transformJSX(jsxCode)
    expect(typeof result).toBe('string')
  })

  it('should include Vue imports for createVNode', () => {
    const jsxCode = 'const el = <div>Hello</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('import')
    expect(result).toContain('vue')
  })

  it('should handle JSX with string literal children', () => {
    const jsxCode = 'const el = <div>{"Hello World"}</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('Hello World')
  })

  it('should handle JSX with number children', () => {
    const jsxCode = 'const el = <div>{42}</div>'
    const result = transformJSX(jsxCode)
    expect(result).toContain('createVNode')
    expect(result).toContain('"div"')
    expect(result).toContain('42')
  })
})
