## 如何在 Vue 3 中实现一个复杂的表单验证和提交逻辑？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
在 Vue 3 中实现一个复杂的表单验证和提交逻辑，可以使用 `<template>`, `<script setup>` 和 `<style>` 三个部分来构建。你需要一个表单，每个输入域都有验证规则，当验证通过后提交表单。最常用的工具之一是 `VeeValidate` 和 `Yup`，它们能大大简化表单验证的过程。

1）首先，将 `VeeValidate` 和 `Yup` 安装到项目中。
```bash
npm install vee-validate yup
```

2）然后在你的 Vue 组件中引入以上库：
```javascript
<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="name">Name:</label>
      <input v-model="form.name" name="name" />
      <span>{{ errors.name }}</span>
    </div>
    
    <div>
      <label for="email">Email:</label>
      <input v-model="form.email" name="email" />
      <span>{{ errors.email }}</span>
    </div>

    <div>
      <button type="submit">Submit</button>
    </div>
  </form>
</template>

<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required')
});

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema
});

const form = ref({
  name: '',
  email: ''
});

const onSubmit = values => {
  console.log(values);
  resetForm();
};

</script>
```
这个例子通过 `VeeValidate` 和 `Yup` 定义验证逻辑并和表单绑定。 `handleSubmit` 是提交逻辑的核心处理函数。

## 扩展知识
在实际开发中，复杂的表单验证往往不仅仅局限于简单的必填和格式验证，可能还有很多自定义的业务逻辑需求。这里再扩展一下如何处理这些情况。

1）**自定义验证**：有时候你需要一些复杂的验证逻辑，比如检查用户名是否已经存在。你可以使用 Yup 的 `test` 方法来实现。
```javascript
const schema = yup.object({
  name: yup.string()
    .required('Name is required')
    .test('unique-check', 'Name already exists', async name => {
      const isUnique = await checkUniqueName(name);
      return isUnique;
    }),
  email: yup.string().email('Invalid email').required('Email is required')
});

async function checkUniqueName(name) {
  // 模拟一个异步请求
  const response = await fetch(`/api/check-name?name=${name}`);
  const result = await response.json();
  return result.isUnique;
}
```

2）**异步和动态表单**：有时表单的某些部分可能是动态生成的，比如根据用户的选择展示不同的表单字段。
```javascript
const form = ref({
  type: 'personal',
  personalDetails: { name: '', email: '' },
  businessDetails: { companyName: '', businessEmail: '' }
});

const schema = computed(() => {
  if (form.value.type === 'personal') {
    return yup.object({
      personalDetails: yup.object({
        name: yup.string().required('Name is required'),
        email: yup.string().email('Invalid email').required('Email is required')
      })
    });
  } else {
    return yup.object({
      businessDetails: yup.object({
        companyName: yup.string().required('Company name is required'),
        businessEmail: yup.string().email('Invalid email').required('Business email is required')
      })
    });
  }
});
```

3）**结合第三方服务**：在一些高级的表单验证和提交中，有时需要结合第三方服务比如 Google reCAPTCHA 来验证用户身份，这可以通过 Vue 组件库或插件来实现。



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)