// ★縦ナビゲーションの処理
$(function () {
	$("ul.menu").hide();
	$("div.category").click(function () {
		$("ul.menu").slideUp();
		$("div.category").removeClass("open");
		if ($("+ul", this).css("display") == "none") {
			$("+ul", this).slideDown();
			$(this).addClass("open");
		}
	});
	$("ul.menu li").mouseover(function () {
		$(this).addClass("rollover");
	}).mouseout(function () {
		$(this).removeClass("rollover");
	});
});



// ★スライダー用の変数作成

jQuery(function ($) {

var o = {
	speed: 300, // スライドするスピード(ミリ秒)
	interval: 3000 // 次のスライドまでの時間(ミリ秒)
};

// 対象となる要素を変数に格納しておく
var $slider = $('#slider'),
	$container = $slider.find('div.slider-container'),
	$contents = $container.children(),
	$firstChild = $contents.filter(':first-child'),
	$lastChild = $contents.filter(':last-child');

// スライドが表示されるエリアのサイズ(スライドするコンテンツ1つ分と同じ)
var size = {
	width: $container.width(),
	height: $container.height() // 今回は使いません
};

// スライドするコンテンツの現在地の管理
var count = {
	min: 0,
	max: $contents.length,
	current: 0
};

// div.slider-container の width を設定する
// 前後にスライドコンテンツ1つ分のスペースを作る(ループ処理に使う)
$container.css({
	width: size.width * ($contents.length + 2),
	marginLeft: -size.width,
	paddingLeft: size.width
});


//   ★スライドする動きと、共通処理を作ります。

var distance; // 移動距離を指定するのに使う
var slide = {

	// スライド(進む)の処理
	next: function (index) {

		// 移動距離を出すための関数
		fnc.range(index, 'positive');

		// スライドアニメーション
		if (count.current < count.max - 1) {

			// 現在地が最後のコンテンツより前の場合の処理
			fnc.scroll(distance);

		} else {

			// 現在地が最後のコンテンツだった場合

			// 最初のコンテンツをコンテナの一番後ろまで移動
			$firstChild.css('left', size.width * $contents.length);

			// 一番最後のコンテンツの次のエリアにスライド
			$container.stop(true, false)
				.animate({
						left: -distance
					}, o.speed,
					// アニメーションコールバック関数
					function () {
						// 移動した最初のコンテンツを元の場所に戻す
						$firstChild.css('left', 0);
						// スライドしていったコンテナ自体も元の場所に戻す
						$container.css('left', 0);
					}
				);

			// 現在地を -1 に (次の処理で 0 になる)
			count.current = -1;
		}

		// 現在地を 1 増やす
		fnc.counter(index, 'increment');

		// ページネーションのクラスを付け替える
		fnc.pageNav(count.current);
	},

	// スライド(戻る)の処理 / 基本的には next の逆の処理をするだけ
	prev: function (index) {
		fnc.range(index, 'negative');
		if (count.current > count.min) {
			fnc.scroll(distance);
		} else {
			$lastChild.css('left', -(size.width * $contents.length));
			$container.stop(true, false)
				.animate({
						left: -distance
					}, o.speed,
					function () {
						$lastChild.css('left', '');
						$container.css('left', -(size.width * ($contents.length - 1)));
					}
				);
			count.current = count.max;
		}
		fnc.counter(index, 'decrement');
		fnc.pageNav(count.current);
	}

};

// ★共通で使われる関数
var fnc = {

	// 移動距離を出す
	range: function (n, d) {
		if (n >= 0) {
			// ページネーションで指定するとき
			distance = size.width * n;
		} else {
			// それ以外 / 自動 or 進む、戻る
			var addNum;
			if (d === 'negative') addNum = -1; // Next
			if (d === 'positive') addNum = +1; // Prev
			distance = size.width * (count.current + addNum);
		}
	},

	// シンプルに移動距離分スライド
	scroll: function (d) {
		$container.stop(true, false).animate({
			left: -d
		}, o.speed);
	},

	// アニメーションするときに現在位置を増減する
	counter: function (n, c) {
		if (n >= 0) {
			// ページネーションで指定するとき
			count.current = n;
		} else {
			if (c === 'increment') count.current++; // 進む
			if (c === 'decrement') count.current--; // 戻る
		}
	},

	// ページネーションのクラス名を振りなおす
	pageNav: function (n) {
		$pagination.children('a').removeClass('current');
		$pagination.children('a:eq(' + n + ')').addClass('current');
	},

	// 進む、戻るをクリックしたときの処理
	pager: function (d, e) {
		if (!$container.is(':animated')) {
			clearInterval(start);
			if (d === 'positive') slide.next(); // 進む
			if (d === 'negative') slide.prev(); // 戻る
			play();
		}
		e.preventDefault(); // リンククリック動作を無効にする
	}

};

//   ★イベント処理、自動スライド、ページネーションです。

var play, start;

// 自動スライド処理
// o.interval で指定した時間ごとに slide.next() を実行する
play = function () {
	start = setInterval(function () {
		slide.next();
	}, o.interval);
};

// スライドコンテンツにホバーしたときの処理
$contents.hover(
	function () {
		// ホバーしたら自動スライドを停止
		clearInterval(start);
	},
	function () {
		// カーソルが離れたら再開
		play();
	}
);

// 進む、戻るの処理
// 共通関数部分を参照
$('#slide-prev').click(function (e) {
	fnc.pager('negative', e);
});

$('#slide-next').click(function (e) {
	fnc.pager('positive', e);
});

// ページネーションを入れる div.slider-pagination を作成
var $pagination = $('<div/>', {
	'class': 'slider-pagination'
});

// スライドするコンテンツ数と同じ数の a 要素を作って div.slider-pagination に追加
$contents.each(function (i) {
	$('<a/>', {
			'href': '#'
		})
		.text(i + 1)
		.appendTo($pagination)

		// クリックイベントを一緒に追加しておく
		.click(function (e) {

			e.preventDefault(); // リンククリック動作を無効にする
			var indexNum = i; // クリックされたリンクのインデックス番号を取得
			clearInterval(start); // 自動スライドを停止

			// インデックス番号が現在地より大きい場合
			if (indexNum > count.current) {
				slide.next(indexNum);
			}
			// インデックス番号が現在地より小さい場合
			else if (indexNum < count.current) {
				slide.prev(indexNum);
			}
			play(); // 自動スライド再開
		});
});

// ★ページネーションを div#slider に追加
$pagination.appendTo($slider);

// ★ページネーションの最初に current というクラス名を付ける
$pagination.find('a:first-child').addClass('current');

// ★auto start
play();

// ★for DEMO
$contents.find('a').click(function (e) {
  e.preventDefault();
});

});