import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {ModalService} from "../shared/modal/modal.service";
import {AuthXService} from "../user/auth/auth-x.service";
import {ActivatedRoute} from "@angular/router";

class Loading {
    articles: boolean
}

class Filter {
    keywords: boolean;
    hidden: boolean;
    saved: boolean;
}

class Timers {
    typeahead: any = [];
    articles: any = null;
}

@Component({
	templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {

    subpage: string;
    grid: boolean = true;

    error: any;
    loading: Loading = new Loading();

    filter: Filter = new Filter();
    rand: number = null;
    current_page: number;
    articles: any;

    user_phrases: Object = {};
    keyword_map: Object = {};

    show_keywords: boolean = false;

    keywordSearch: Observable<string>;
    keyword: string;

    timers: Timers = new Timers();

    public isCollapsed:boolean = true;
    public collapsing:any = null;

    constructor(private activeRoute: ActivatedRoute, private authHttp: AuthXService, private modalService: ModalService) {
        let routeData = this.activeRoute.snapshot.data;
        this.subpage = routeData['subpage'];
        this.error = null;
        this.articles = [];
        this.current_page = 0;

        switch (this.subpage) {
            case 'saved':
                this.filter.saved = true;
                this.filter.hidden = false;
                this.filter.keywords = false;
                break;
            case 'hidden':
                this.filter.saved = false;
                this.filter.hidden = true;
                this.filter.keywords = false;
                break;
            default:
                this.filter.saved = false;
                this.filter.hidden = false;
                this.filter.keywords = true;
                break;
        }

        let show_keywords = localStorage.getItem('show_keywords');
        if (show_keywords !== null)
            this.show_keywords = show_keywords === '1';
    }

    ngOnInit() {
        this.loadArticles();
        this.keywordSearch = Observable.create((observer: any) => {
            this.authHttp.post('/keyword/search', {keyword: this.keyword})
                .subscribe((data: any) => {
                    if (!this.timers.typeahead.pop()) {
                        let keywords = data.json();
                        let ret = [];
                        for (let kw of keywords)
                            ret.push(kw.keyword);
                        observer.next(ret);
                    }
            })
        });

    }

    loadArticles() {
        this.loading.articles = true;
        this.current_page++;
        let body = {page: this.current_page, filter: this.filter, rand: this.rand};
        this.authHttp.post('/feed/articles', body)
            .subscribe(
                data => this.handleArticles(data.json()),
                err => console.error(err),
                () => this.loading.articles = false
            )
    }

    handleArticles(data) {
        this.rand = data.rand;
        for (let phrase of data.user_phrases) {
            // if (this.selected_keywords.indexOf(keyword.id) < 0) {
            //     this.selected_keywords.push(keyword.id);
            //     this.keywords[keyword.id] = keyword;
            // }
            if (!this.user_phrases[phrase.id])
                this.user_phrases[phrase.id] = phrase;
        }
        this.keyword_map = data.keyword_map;
        for (let article of data.articles.data)
            this.articles.push(article);
    }

    reloadArticles() {
        this.articles = [];
        this.current_page = 0;
        this.loadArticles();
    }

    onScroll() {
        this.loadArticles();
    }

    toggleShowKeywords() {
        this.show_keywords = !this.show_keywords;
        localStorage.setItem('show_keywords', (this.show_keywords ? '1' : '0'));
    }

    toggleFilter() {
        localStorage.setItem('filter.keywords', (this.filter.keywords ? '1' : '0'));
        this.reloadArticles();
    }

    toggleKeyword(keyword) {
        if (this.keyword_map[keyword.id]) {
            this.authHttp.post('/keyword/remove', {keyword_id: keyword.id})
                .subscribe(
                    data => {
                        console.log(data.json());
                        for (let map of this.keyword_map[keyword.id])
                            if (this.user_phrases[map.phrase_id])
                                delete this.user_phrases[map.phrase_id];
                    },
                    err => console.error(err)
                );
            if (this.filter.keywords) {
                if (this.timers.articles)
                    clearTimeout(this.timers.articles);
                this.timers.articles = setTimeout(() => {
                    this.timers.articles = null;
                    this.reloadArticles();
                }, 500);
            }
        } else {
            this.authHttp.post('/phrase/add', {keyword_id: keyword.id})
                .subscribe(
                    data => {
                        if (data) {
                            let phrase = data.json();
                            this.user_phrases[phrase.id] = phrase;
                        }
                    },
                    err => console.error(err)
                );
            if (this.filter.keywords) {
                if (this.timers.articles)
                    clearTimeout(this.timers.articles);
                this.timers.articles = setTimeout(() => {
                    this.timers.articles = null;
                    this.reloadArticles();
                }, 500);
            }

        }
        // if (this.selected_keywords.indexOf(keyword.id) > -1) {
        //     this.selected_keywords.splice(this.selected_keywords.indexOf(keyword.id), 1);
        //     delete this.keywords[keyword.id];
        //     this.authHttp.post('/keyword/remove', {keyword_id: keyword.id})
        //         .subscribe(
        //             data => console.log(data.json()),
        //             err => console.error(err)
        //         );
        //     if (this.filter.keywords) {
        //         if (this.timers.articles)
        //             clearTimeout(this.timers.articles);
        //         this.timers.articles = setTimeout(() => {
        //             this.timers.articles = null;
        //             this.reloadArticles();
        //         }, 500);
        //     }
        // } else {
        //     this.selected_keywords.push(keyword.id);
        //     this.keywords[keyword.id] = keyword;
        //     this.authHttp.post('/keyword/add', {keyword_id: keyword.id})
        //         .subscribe(
        //             data => console.log(data.json()),
        //             err => console.error(err)
        //         );
        // }
    }

    removePhrase(phrase_id) {
        if (this.user_phrases[phrase_id]) {
            delete this.user_phrases[phrase_id];
            this.authHttp.post('/phrase/remove', {phrase_id: phrase_id})
                .subscribe(
                    data => console.log(data.json()),
                    err => console.error(err)
                );
            if (this.filter.keywords) {
                if (this.timers.articles)
                    clearTimeout(this.timers.articles);
                this.timers.articles = setTimeout(() => {
                    this.timers.articles = null;
                    this.reloadArticles();
                }, 500);
            }
        }
    }

    onAddKeyword(form: NgForm) {
        if (form.value.keyword.length < 2)
            return;
        this.timers.typeahead.push(true);
        this.authHttp.post('/phrase/add', {phrase: form.value.keyword})
            .subscribe(
                data => {
                    if (data) {
                        let phrase = data.json();
                        this.user_phrases[phrase.id] = phrase;
                        if (this.filter.keywords) {
                            if (this.timers.articles)
                                clearTimeout(this.timers.articles);
                            this.timers.articles = setTimeout(() => {
                                this.timers.articles = null;
                                this.reloadArticles();
                            }, 500);
                        }
                    }
                },
                err => console.error(err),
                () => form.reset()
            )
    }

    hideArticle(article: any, index) {
        let hidden = true;
        if (article.users.length > 0)
            hidden = !article.users[0].hidden;
        this.authHttp.post('/feed/hide', {article_id: article.id, hidden: hidden})
            .subscribe(
                res => {
                    if (article.users.length > 0)
                        article.users[0].hidden = hidden;
                    else
                        article.users.push({hidden: hidden});
                    this.doRemoveArticle(hidden, index);
                },
                err => console.error(err)
            )
    }

    private static getArticleHideSave(article) {
        let hidden = false;
        let saved = false;
        if (article.users.length > 0) {
            hidden = article.users[0].hidden;
            saved = article.users[0].saved;
        }
        return {hidden: hidden, saved: saved};
    }

    getKeywordClass(article, keyword_id) {
        let has_phrase = false;
        if (this.keyword_map[keyword_id]) {
            for (let map of this.keyword_map[keyword_id]) {
                if (map.keyword_ids.length < 1)
                    return 'selected';
                if (!has_phrase) {
                    let has_all = true;
                    for (let kw_id of map.keyword_ids) {
                        if (!this.articleHasKeyword(article, kw_id))
                            has_all = false;
                    }
                    if (has_all)
                        has_phrase = true;
                }
            }
        }
        if (has_phrase)
            return 'selected-phrase';
        return null;
    }

    private articleHasKeyword(article, keyword_id) {
        for (let keyword of article.keywords) {
            if (keyword.id === keyword_id)
                return true;
        }
        return false;
    }

    getOpacity(article) {
        let props = FeedComponent.getArticleHideSave(article);
        if (this.subpage === 'hidden')
            return !props.hidden ? 0 : 1;
        if (this.subpage === 'saved')
            return props.hidden || !props.saved ? 0 : 1;
        return props.hidden ? 0 : 1;
    }

    doRemoveArticle(condition, index) {
        if (this.subpage === 'hidden') {
            // condition is reversed for the hidden view
            if (!condition) {
                setTimeout(() => {
                    this.articles.splice(index, 1);
                }, 400);
            }
        } else if (condition) {
            setTimeout(() => {
                this.articles.splice(index, 1);
            }, 400);
        }

    }

    saveArticle(article: any, index) {
        let saved = true;
        if (article.users.length > 0)
            saved = !article.users[0].saved;
        this.authHttp.post('/feed/save', {article_id: article.id, saved: saved})
            .subscribe(
                res => {
                    if (article.users.length > 0)
                        article.users[0].saved = saved;
                    else
                        article.users.push({saved: saved});
                    if (this.subpage === 'saved') // condition is reversed for saved view
                        this.doRemoveArticle(!saved, index);
                },
                err => console.error(err)
            )
    }

    toggleCollapse() {
        this.collapsing = setTimeout(() => this.collapsing = null, 300);
        this.isCollapsed = !this.isCollapsed;
    }

    onClickOutside() {
        if (!this.collapsing && !this.isCollapsed)
            this.isCollapsed = true;
    }
}