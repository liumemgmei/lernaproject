import { useContext, useEffect, useRef, useState } from 'react';
import './App.css';
import { observer } from 'mobx-react-lite'
import { Context } from './globalstore/index';
import { Button, Input, Form, Typography, Row, Col } from 'antd';
import axios from 'happy-axios'
//@ts-ignore
import parseMarkdown from 'front-matter-markdown';
const { Paragraph } = Typography;
type Icode = {
  remark: string;
  path: string;
  type: string;
  req: string;
  res: string;
}
function App() {
  const store = useContext(Context);
  const [code, setCode] = useState('');
  console.log(store);
  const [form] = Form.useForm();
  const onSearch = () => {
    const content = form.getFieldValue('content')
    console.log(content, JSON.parse(content))
    let md = JSON.parse(content);
    let mdData = parseMarkdown(md.data.page_content);
    analyze(mdData.$compiled);

  }
  const analyze = (data: Array<any>) => {
    console.log(data)
    let text = data.filter((item) => item.type === 'text');
    let paragraph = data.filter((item) => item.type === 'paragraph');
    let table = data.filter((item) => item.type === 'table');
    console.log(text)
    console.log(table)
    console.log(paragraph)
    let req: any = {};
    if (table[0] && table[0].cells) {
      let arr = table[0].cells;
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        req[element[0]] = element[2]
      }
    }
    let reaStr = JSON.stringify(req).replaceAll('"string"', 'string');
    if (table[1]) {

    }
    try {
      form.setFieldsValue({
        remark: text[0].text,
        path: text[1].text.replace(/`/g, ''),
        type: text[2].text.replace('-', ''),
        req: reaStr
      })
    } catch (error) {
    }

  }
  const template = (params: Icode & { funcname: string }) => {
    return `
    // ${params.remark}
    ${params.funcname}(params: ${params.req}) {
      return createService('${params.type.toLocaleUpperCase()} ${params.path}', params);
    },
    `
  }
  const onFinish = (values: Icode) => {
    let temp = values.path.split('/');
    let funcname = temp[temp.length - 1];
    let codestr = template({ ...values, funcname });
    setCode(codestr)
    form.setFieldsValue({ result: code })
  }
  useEffect(() => {
    axios.get(' http://showdoc.beiquanren.com/server/index.php?s=/api/page/info')
  })
  return (
    <div className="App">
      <Form onFinish={onFinish} style={{ width: '680px' }} form={form}>
        <Form.Item label="showdoc">
          <Form.Item noStyle name='content'>
            <Input.TextArea rows={10} style={{ width: '500px' }} />
          </Form.Item>
          <Button onClick={onSearch}>解析</Button>
        </Form.Item>
        <Form.Item label="接口名称" name="remark">
          <Input />
        </Form.Item>
        <Form.Item label="接口路径" name="path">
          <Input />
        </Form.Item>
        <Form.Item label="请求方式" name="type">
          <Input />
        </Form.Item>
        <Form.Item label="请求参数" name="req">
          <Input />
        </Form.Item>
        <Row><Col><Button htmlType='submit'>生成代码</Button></Col><Col><Paragraph copyable>{code}</Paragraph></Col></Row>


      </Form>
    </div>
  );
}

export default observer(App);
