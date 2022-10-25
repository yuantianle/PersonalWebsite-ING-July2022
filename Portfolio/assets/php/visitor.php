<?php
//这个类似用来获取访客信息
//方便统计
require_once('IPQuery.class.php'); //引入IP库，具体查询 http://www.dedenotes.com/html/php-ipquery.html
class visitor
{
  //获取访客ip
  public function getIp()
  {
    $ip=false;
    if(!empty($_SERVER["HTTP_CLIENT_IP"])){
      $ip = $_SERVER["HTTP_CLIENT_IP"];
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
      $ips = explode (", ", $_SERVER['HTTP_X_FORWARDED_FOR']);
      if ($ip) { array_unshift($ips, $ip); $ip = FALSE; }
      for ($i = 0; $i < count($ips); $i++) {
        if (!eregi ("^(10│172.16│192.168).", $ips[$i])) {
          $ip = $ips[$i];
          break;
        }
      }
    }
    return ($ip ? $ip : $_SERVER['REMOTE_ADDR']);
  }
  //获取城市、网络运营商等信息
  public function CityByIp(){
    $ip = new IPQuery();
    $myip = $_SERVER ['REMOTE_ADDR']; //获取本机ip
    $addr = $ip->query($myip);
    return $addr['pos']; //获取城市，如想获取访问运营商请加上 .$addr['isp'];
  }
  //获取操作系统
  public function getOS(){
    $agent=$_SERVER["HTTP_USER_AGENT"];
    if(strpos($agent,'Android')!==false)
      return "Android";
    else if(strpos($agent,'BlackBerry')!==false || strpos($agent,'PlayBook')) //黑莓
      return "BlackBerry";
    else if(strpos($agent,'(iPhone')!==false)
      return 'iPhone';
    else if(strpos($agent,'iPad')!==false)
      return 'iPad';
    else if(strpos($agent,'CrOS')!==false)
      return "Chrome OS";
    else if(strpos($agent,'Mac')!==false)
      return "Mac OS";
    else if(strpos($agent,'Windows')!==false)
      return "Windows";
    else if(strpos($agent,'Linux')!==false)
      return "Linux";	  
    else
      return 'unknown';
  }
  //获取用户浏览器类型
  public function getBrowser(){
    $agent=$_SERVER["HTTP_USER_AGENT"];
    if(strpos($agent,'UCBrowser')!==false)
      return "UC Browser";
    else if(strpos($agent,'MSIE')!==false || strpos($agent,'rv:11.0')) //ie11判断
      return "IE";	    
    else if(strpos($agent,'Firefox')!==false)
      return "Firefox";
    else if(strpos($agent,'OPR')!==false)
      return 'Opera';
    else if((strpos($agent,'EdgiOS')==false)&&strpos($agent,'Edg')!==false)
      return 'Edge';    
    else if(strpos($agent,'MicroMessage')!==false) //微信浏览器
      return "MicroMessage";
    else if(strpos($agent,'Chrome')!==false)
      return "Chrome";
    else if((strpos($agent,'Chrome')==false)&&strpos($agent,'Safari')!==false)
      return 'Safari';
    else
      return 'unknown';
  }
  //获取浏览器版本
  public function getBrowserVer(){
    $agent= $_SERVER['HTTP_USER_AGENT'];
    if (preg_match('/UCBrowser\/(\d+.\d+.\d+.\d+)/i', $agent, $regs))
      return $regs[1];
    elseif (preg_match('/MSIE\s(\d+.\d+)/i', $agent, $regs) || preg_match('/rv:(\d+.\d+)/i', $agent, $regs))
      return $regs[1];	  
    elseif (preg_match('/FireFox\/(\d+.\d+.\d+)/i', $agent, $regs))
      return $regs[1];
    elseif (preg_match('/OPR\/(\d+.\d+.\d+.\d+)/i', $agent, $regs))
      return $regs[1];
    elseif (preg_match('/Edg\w?\/(\d+.\d+.\d+.\d+)/i', $agent, $regs))
      return $regs[1];  
    elseif (preg_match('/Chrome\/(\d+.\d+.\d+.\d+)/i', $agent, $regs))
      return $regs[1];
    elseif ((strpos($agent,'Chrome')==false)&&preg_match('/Safari\/(\d+.\d+.\d+)/i', $agent, $regs))
      return $regs[1];
    else
      return 'unknow';
  }
  //获取来访页面
  public function getFromPage(){
    return $_SERVER['HTTP_REFERER'];
  }
}
?>