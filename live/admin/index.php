<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Auto Webinar System-Admin</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
        <!-- <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script> -->
        <script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js"></script>
        <script src="//player.vimeo.com/api/player.js"></script>
        <script src="livesite.js"></script>
        <script src="functions.js"></script>
        <link href="../style.css" rel="stylesheet" />
        <style>
            @media screen and (max-width:480px) {
.sp-mode{padding:0 !important;}
}
.container{max-width:800px;}
        </style>
    </head>
<body>
<header class="py-2 sp-mode">
  <nav class="navbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        Auto Webinar System-Admin
      </a>
    </div>
  </nav>
</header>

<?php
// ADMINログインパスワード
$pw = '11112222';
$is_login = false;

if( isset($_COOKIE['s_adm']))
{
  if( password_verify($pw, $_COOKIE['s_adm']) )
      $is_login = true;
  else
    setcookie('s_adm', '', -1);
}

if( isset($_POST['password']))
{
  if( $_POST['password'] == $pw )
  {
      setcookie('s_adm', password_hash($pw, PASSWORD_DEFAULT), time()+60*60*24*7);
      $is_login = true;
  }
}

if( $is_login == false )
{
    // ログインページ
?>
  <section class="py-4">
  <div class="container">
      <div class="row">
          <div class="col-sm-12">
              <form action="" method="POST">
                    <div class="form-floating mb-3">
                    <input type="password" class="form-control" name="password" id="mov-url">
                    <label for="mov-url" class="form-label">パスワード</label>
                  </div>
                  <p class="text-end"><button type="submit" class="btn btn-primary">ログイン</button></p>
                </form>
          </div>
      </div>
  </div>
  </section>

<?php }
else
{
  // ADMINページ
  if( isset($_POST['url']) )
  {
    $ini_for_save = fopen('../seting.ini', "w");
    fwrite($ini_for_save, 'vimeo_id=' . str_replace('https://vimeo.com/','', $_POST['url']). "\n" );
    fwrite($ini_for_save, 'start_hour=' . $_POST['hour']. "\n");
    fwrite($ini_for_save, 'start_min=' . $_POST['min']. "\n");
    fwrite($ini_for_save, 'link_delay_min=' . $_POST['delay']. "\n");
    fwrite($ini_for_save, 'link_url=' . $_POST['link-url']. "\n");
    fclose($ini_for_save);
  }
  
  // 設定ファイルロード
    $config = parse_ini_file('../seting.ini', false);
    $url = 'https://vimeo.com/' . $config['vimeo_id'];
    $hour = $config['start_hour'];
    $min = $config['start_min'];
    $delay = $config['link_delay_min'];
    $link_url = $config['link_url'];
?>
  
    <script type="text/javascript">
  $(document).ready(function() {
  //    OnInitialize();
  });
  </script>
  
  <section class="py-4">
  <div class="container">
      <div class="row">
          <div class="col-sm-12">
              <form action="" method="POST">
                    <div class="form-floating mb-3">
                    <input type="text" class="form-control" name="url" id="mov-url" placeholder="https://vimeo.com/XXXXXXXX/XXXXXXXX" value="<?php echo $url;?>">
                    <label for="mov-url" class="form-label">動画URL</label>
                    <div id="emailHelp" class="form-text">※Vimeoのみ対応</div>
                  </div>
                  <div class="mb-3">
                    <label for="mov-time" class="form-label">開始時刻設定</label>
                    <div class="input-group mb-3">
                      <select class="form-select" name="hour">
                          <option value="1" <?php echo $config['start_hour'] == 1 ? 'selected' : '';?>>1</option>
                          <option value="2" <?php echo $config['start_hour'] == 2 ? 'selected' : '';?>>2</option>
                          <option value="3" <?php echo $config['start_hour'] == 3 ? 'selected' : '';?>>3</option>
                          <option value="4" <?php echo $config['start_hour'] == 4 ? 'selected' : '';?>>4</option>
                          <option value="5" <?php echo $config['start_hour'] == 5 ? 'selected' : '';?>>5</option>
                          <option value="6" <?php echo $config['start_hour'] == 6 ? 'selected' : '';?>>6</option>
                          <option value="7" <?php echo $config['start_hour'] == 7 ? 'selected' : '';?>>7</option>
                          <option value="8" <?php echo $config['start_hour'] == 8 ? 'selected' : '';?>>8</option>
                          <option value="9" <?php echo $config['start_hour'] == 9 ? 'selected' : '';?>>9</option>
                          <option value="10" <?php echo $config['start_hour'] == 10 ? 'selected' : '';?>>10</option>
                          <option value="11" <?php echo $config['start_hour'] == 11 ? 'selected' : '';?>>11</option>
                          <option value="12" <?php echo $config['start_hour'] == 12 ? 'selected' : '';?>>12</option>
                          <option value="13" <?php echo $config['start_hour'] == 13 ? 'selected' : '';?>>13</option>
                          <option value="14" <?php echo $config['start_hour'] == 14 ? 'selected' : '';?>>14</option>
                          <option value="15" <?php echo $config['start_hour'] == 15 ? 'selected' : '';?>>15</option>
                          <option value="16" <?php echo $config['start_hour'] == 16 ? 'selected' : '';?>>16</option>
                          <option value="17" <?php echo $config['start_hour'] == 17 ? 'selected' : '';?>>17</option>
                          <option value="18" <?php echo $config['start_hour'] == 18 ? 'selected' : '';?>>18</option>
                          <option value="19" <?php echo $config['start_hour'] == 19 ? 'selected' : '';?>>19</option>
                          <option value="20" <?php echo $config['start_hour'] == 20 ? 'selected' : '';?>>20</option>
                          <option value="21" <?php echo $config['start_hour'] == 21 ? 'selected' : '';?>>21</option>
                          <option value="22" <?php echo $config['start_hour'] == 22 ? 'selected' : '';?>>22</option>
                          <option value="23" <?php echo $config['start_hour'] == 23 ? 'selected' : '';?>>23</option>
                          <option value="0" <?php echo $config['start_hour'] == 0 ? 'selected' : '';?>>0</option>
                      </select>
                      <span class="input-group-text">時</span>
                      
                      <select class="form-select" name="min">
                      <?php for($min = 1 ; $min < 60 ; $min++ )
                      {
                          echo '<option value="'. $min. '"'. ( $config['start_min'] == $min ? 'selected' : '') . '>'. $min . '</option>';
                      }
                      echo '<option value="00"'. ( $config['start_min'] == 0 ? 'selected' : '') . '>00</option>';
                      ?>
  
                     </select>
                      <span class="input-group-text">分</span>
                    </div>



                    <label for="link-display" class="form-label">リンクボタン表示</label>
                    <div class="input-group mb-3">

                      <select class="form-select" name="delay">
                        <option value="0" <?php echo $config['link_delay_min'] == 0 ? 'selected' : '';?>>指定なし（無効）</option>
                        <?php for($min = 1 ; $min <= 60 ; $min++ )
                        {
                            echo '<option value="'. $min. '"'. ( $config['link_delay_min'] == $min ? 'selected' : '') . '>'. $min . '</option>';
                        }
                        ?>
                        <?php for($min = 70 ; $min <= 180 ; $min = $min + 10 )
                        {
                            echo '<option value="'. $min. '"'. ( $config['link_delay_min'] == $min ? 'selected' : '') . '>'. $min . '</option>';
                        }
                        ?>
                        <?php for($min = 210 ; $min <= 300 ; $min = $min + 30 )
                        {
                            echo '<option value="'. $min. '"'. ( $config['link_delay_min'] == $min ? 'selected' : '') . '>'. $min . '</option>';
                        }
                        ?>
    
                      </select>
                        <span class="input-group-text">分後</span>

                    </div>
                  </div>
                  <div class="form-floating mb-3">
                    <input type="text" class="form-control" name="link-url" id="link-url" placeholder="詳細ページへのジャンプ先URL" value="<?php echo $link_url;?>">
                    <label for="link-url" class="form-label">ボタンリンク先URL</label>
                  </div>
                  <p class="text-end"><button type="submit" class="btn btn-primary">保存する</button></p>
                </form>
          </div>
          
      </div>
  </div>
  </section>
  
<?php } ?>

<footer class="py-4">
    <p>&copy; Auto Webinar System.</p>
</footer>

</body>
</html>