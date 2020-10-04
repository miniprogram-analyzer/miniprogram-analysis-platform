#/bin/bash
# 网站压力测试

# 使用方法
# bash 环境下：bash ab.sh

# 当前 ab(apache benchmark) http://httpd.apache.org/docs/2.4/programs/ab.html
# 可选 阿里云 PTS https://help.aliyun.com/document_detail/95647.html

# 预期
# 并发数 500-1000
# 评估标准可参考：https://help.aliyun.com/document_detail/29337.html

# 评估重点
# HTML transferred HTML页面大小
# Requests per second 每秒支持多少人访问
# Time per request 满足一个请求花费的总时间
# Time per request 满足所有并发请求中的一个请求花费的总时间

set -ex

# 示例：首页
# WEBSITE="http://blog.f00bar.top/"
# WEBSITE="http://bilibili.com/"
WEBSITE="http://bupt-c607.cn/"
# WEBSITE="http://code.f00bar.top/"
# WEBSITE="http://aidata.welishi.cn/#/timeline"
# WEBSITE="https://oursparkspace.cn/"

# ab -n 总请求数 -c 并发数 网站接口 -e 输出至CSV文件

# ab -n 100 -c 10 $WEBSITE

# ab -n 1000 -c 10 $WEBSITE

ab -n 500 -c 100 $WEBSITE

# ab -n 5000 -c 500 $WEBSITE

# ab -n 10000 -c 1000 $WEBSITE

# 登录
# ab -n 10000 -c 100 -T "application/json" -p "ab-login.txt" http://bupt-c607.cn/api/login

# 获取用户信息
# curl -d 'nameOrid=2020999000' -d 'password=2020999000' http://bupt-c607.cn/api/login -i
# curl -i -b "EGG_SESS=Fp9ZX51qslBi_NVdk8_YnbMv9FjTvfVHwmvKHm5tsuaqCRapLg7SlMdLIe_zpKmT11AK9jmM7dgJCV-uRN4tIh7GxXkAyC-gf1yCIRdsxA8=; path=/api; max-age=86400; expires=Fri, 18 Sep 2020 04:19:56 GMT; httponly" -X POST http://bupt-c607.cn/api/getUserinfo
# ab -n 1000 -c 100 -p "ab-userinfo.txt" -T "application/json" -C "EGG_SESS=Fp9ZX51qslBi_NVdk8_YnbMv9FjTvfVHwmvKHm5tsuaqCRapLg7SlMdLIe_zpKmT11AK9jmM7dgJCV-uRN4tIh7GxXkAyC-gf1yCIRdsxA8=; path=/api; max-age=86400; expires=Fri, 18 Sep 2020 04:19:56 GMT; httponly" http://bupt-c607.cn/api/getUserinfo
