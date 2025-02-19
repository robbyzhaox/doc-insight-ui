export async function POST(request) {
    // 模拟处理延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
  
    // 获取表单数据
    const formData = await request.formData()
    const file = formData.get('file')
    const template = formData.get('template')
  
    // 验证输入
    if (!file || !template) {
      return Response.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }
  
    // 模拟20%错误率
    if (Math.random() < 0.2) {
      return Response.json(
        { message: 'Internal server error' },
        { status: 500 }
      )
    }
  
    // 模拟成功响应
    const mockData = {
      success: true,
      data: {
        fileName: file.name,
        templateType: template,
        extractedFields: {
          name: 'John Doe',
          amount: '$1,234.56',
          date: new Date().toISOString().split('T')[0]
        }
      }
    }
  
    return Response.json(mockData)
  }